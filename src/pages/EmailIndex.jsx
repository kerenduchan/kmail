// react
import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'

// pages
import { EmailCompose } from './EmailCompose'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
import { EmailLabelIndex } from '../cmps/email-label/EmailLabelIndex'
import { EmailLabelCreate } from '../cmps/email-label/EmailLabelCreate'
import { Logo } from '../cmps/Logo'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'
import { EmailListTopbar } from '../cmps/EmailListTopbar'

// services and utils
import { emailService } from '../services/email.service'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'
import { labelService } from '../services/label.service'
import { getEmailFilterFromParams, sanitizeFilter } from '../util/util'
import {
    buildMsgsForDeleteEmailsForever,
    buildMsgsForMoveEmailsToBin,
    buildMsgsForSaveLabel,
    buildMsgsForUpdateLabelsForEmails,
} from '../util/msgBuilder'

// The email index - main component for managing emails
export function EmailIndex() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    // The emails filter
    const [filter, setFilter] = useState(null)

    // All the emails currently being displayed
    const [emailsData, setEmailsData] = useState(null)

    // IDs of all selected emails.
    const [selectedEmailIds, setSelectedEmailIds] = useState([])

    /* For the sidebar =======================================================*/

    // Email counts (total, unread) per folder.
    // Needed for the folder counts in the sidebar.
    const [emailCounts, setEmailCounts] = useState(null)

    // Show/hide the sidebar (for mobile only)
    const [showSidebar, setShowSidebar] = useState(false)

    /* For the label create/edit dialog ======================================*/

    // All the labels
    const [labels, setLabels] = useState(null)

    // The currently edited label. Needed for the label create/edit dialog
    const [selectedLabel, setSelectedLabel] = useState(null)

    // toggle for showing/hiding the create/edit label dialog
    const [showCreateLabelDialog, setShowCreateLabelDialog] = useState(false)

    /* useEffect =============================================================*/

    // Params and search params are the single source of truth for the filter
    useEffect(() => {
        setFilter(getEmailFilterFromParams(params, searchParams))
        loadLabels()
    }, [params, searchParams])

    // Changing the filter refreshes the emails
    useEffect(() => {
        if (filter !== null) {
            loadEmails()
        }
    }, [filter])

    /* "on" handlers =========================================================*/

    // Handle a folder being clicked in the sidebar
    function onFolderClick(folder) {
        hideUserMsg()
        // go to the clicked folder, while retaining only the compose part
        // of the search params
        const navigateArgs = {
            pathname: `/email/${folder}`,
        }
        const composeVal = searchParams.get('compose')
        if (composeVal) {
            navigateArgs.search = `?compose=${composeVal}`
        }
        navigate(navigateArgs)
    }

    // Handle a compose button click
    function onComposeClick() {
        hideUserMsg()
        // open the compose dialog, while staying in the same folder and
        // retaining the search params
        setSearchParams((prev) => {
            prev.set('compose', 'new')
            return prev
        })
    }

    // Handle a change in the emails filter
    function onFilterChange(fieldsToUpdate) {
        // update the search params accordingly
        setSearchParams((prev) => {
            const f = {
                ...getEmailFilterFromParams(prev, searchParams),
                ...fieldsToUpdate,
            }
            return sanitizeFilter(f)
        })
    }

    // Handle a change in the email, such as mark as read (save the email)
    async function onUpdateEmail(email) {
        hideUserMsg()
        try {
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            showErrorMsg('Failed to update email', err)
        }
    }

    // Handle the compose email dialog being closed
    function onEmailComposeCloseClick() {
        // close the compose dialog
        setSearchParams((prev) => {
            prev.delete('compose')
        })
        loadEmails()
    }

    // Handle a draft being deleted from within the compose dialog
    async function onDeleteDraft(emailId) {
        const { success, error } = buildMsgsForMoveEmailsToBin('drafts', [
            emailId,
        ])
        if (emailId !== null) {
            try {
                await emailService.remove(emailId)
                showSuccessMsg(success)
            } catch (err) {
                showErrorMsg(error)
            }
            loadEmails()
        }
        onEmailComposeCloseClick()
    }

    // Handle an email click (show the email details or edit the draft)
    function onEmailClick(emailId) {
        hideUserMsg()
        if (params.folderId == 'drafts') {
            // edit draft
            setSearchParams((prev) => {
                return { ...prev, compose: emailId }
            })
        } else {
            // view email details, while retaining the search params
            navigate({
                pathname: `/email/${params.folderId}/${emailId}`,
                search: location.search,
            })
        }
    }

    // handle the email checkbox (select/deselect) being clicked
    function onEmailCheckboxClick(emailId, isChecked) {
        if (isChecked) {
            // deselect the email
            setSelectedEmailIds((prev) => prev.filter((id) => id != emailId))
        } else {
            // select the email
            setSelectedEmailIds((prev) => prev.concat([emailId]))
        }
    }

    // Handle the hamburger menu being clicked (mobile only)
    function onHamburgerMenuClick() {
        setShowSidebar((prev) => !prev)
    }

    // Hide the sidebar (mobile only)
    function onHideSidebar() {
        setShowSidebar(false)
    }

    // Handle a state change in the email multi-selector in the top bar
    function onMultiSelectorChange(state) {
        switch (state) {
            case 'none':
                // deselect all emails
                setSelectedEmailIds([])
                break
            case 'all':
                // select all emails
                setSelectedEmailIds(emailsData.emails.map((e) => e.id))
                break
        }
    }

    // Handle a click on the "delete" button in the top bar - delete selected
    // emails
    async function onDeleteSelectedEmailsClick() {
        await deleteEmailsByIds(selectedEmailIds)
    }

    // Handle a click on the create/save button in the label create/edit dialog
    async function onSaveLabelClick(label) {
        const { success, error } = buildMsgsForSaveLabel(label)
        try {
            if (label.id) {
                await labelService.updateLabel(label)
            } else {
                await labelService.createLabel(label)
            }
            await loadLabels()
            showSuccessMsg(success)
        } catch (e) {
            showErrorMsg(error, e)
        }
        onHideCreateLabelDialog()
    }

    // Handle a click on the delete label button for the given label
    async function onDeleteLabelClick(label) {
        await emailService.removeLabelFromAllEmails(label.id)
        await loadEmails()
        // delete the label from the list of labels
        await labelService.deleteLabel(label.id)
        await loadLabels()
        showSuccessMsg(`Label '${label.name}' deleted.`)
    }

    // Handle a click on the edit label button for the given label
    async function onEditLabelClick(label) {
        setSelectedLabel(label)
        hideUserMsg()
        setShowCreateLabelDialog(true)
    }

    // Close the create/edit label dialog
    function onHideCreateLabelDialog() {
        setShowCreateLabelDialog(false)
        setSelectedLabel(null)
    }

    // Show the create/edit label dialog
    function onShowCreateLabelDialog() {
        hideUserMsg()
        setShowCreateLabelDialog(true)
    }

    // Load the emails from the email service, based on the filter
    async function loadEmails() {
        try {
            let [emailCounts, emails] = await Promise.all([
                emailService.getEmailCountsPerFolder(),
                emailService.query(filter),
            ])
            setEmailsData({
                emails,
                folder: filter.folder,
            })
            setEmailCounts(emailCounts)
            // deselect any emails that have been filtered out
            setSelectedEmailIds((prev) =>
                prev.filter((emailId) =>
                    emails.map((e) => e.id).includes(emailId)
                )
            )
        } catch (err) {
            showErrorMsg('Error loading emails', err)
        }
    }

    // load the labels from the label service
    async function loadLabels() {
        try {
            const labels = await labelService.getAllLabels()
            setLabels(labels)
        } catch (err) {
            showErrorMsg('Error loading labels', err)
        }
    }

    // Update all the given emails
    async function updateEmails(emails, msg) {
        hideUserMsg()
        try {
            await emailService.updateMany(emails)
            showSuccessMsg(msg)
            await loadEmails()
        } catch (err) {
            showErrorMsg(
                `Failed to update email${emails.length === 1 ? '' : 's'}`,
                err
            )
        }
    }

    // add/remove the given label IDs to/from the given emails
    async function updateLabelsForEmails(emails, labelInfos) {
        const { success, error } = buildMsgsForUpdateLabelsForEmails(
            params.folderId,
            emails,
            labelInfos
        )
        try {
            await emailService.updateLabelsForEmails(emails, labelInfos)
            showSuccessMsg(success)
        } catch (e) {
            showErrorMsg(error, e)
        }
        loadEmails()
    }

    // Delete all the given emails or drafts
    async function deleteEmailsByIds(emailIds) {
        if (params.folderId == 'bin') {
            // Delete emails forever
            const { success, error } = buildMsgsForDeleteEmailsForever(
                params.folderId,
                emailIds
            )
            try {
                await emailService.deleteEmailsByIds(emailIds)
                showSuccessMsg(success)
            } catch (err) {
                showErrorMsg(error)
            }
        } else {
            // Move emails to bin
            const { success, error } = buildMsgsForMoveEmailsToBin(
                params.folderId,
                emailIds
            )
            try {
                const emails = getEmailsByIds(emailIds)
                emails.forEach((e) => {
                    e.deletedAt = Date.now()
                })
                await emailService.updateMany(emails)
                showSuccessMsg(success)
            } catch (err) {
                showErrorMsg(error)
            }
        }
        await loadEmails()
    }

    // Get emails by IDs
    function getEmailsByIds(emailIds) {
        if (emailsData === null) {
            return []
        }
        return emailsData.emails.filter((e) => emailIds.includes(e.id))
    }

    /* JSX ===================================================================*/

    if (!emailsData || !emailCounts) return <div>Loading..</div>

    return (
        <section className="email-index">
            {/* Hamburger menu button - for mobile only */}
            <SmallActionButton
                className="hamburger-menu-button"
                type="hamburger"
                onClick={onHamburgerMenuClick}
            />

            {/* Logo */}
            <Logo />

            {/* Email Filter */}
            <EmailFilter filter={filter} onChange={onFilterChange} />

            {/* Sidebar */}
            <div
                className={'email-sidebar-bg' + (showSidebar ? ' visible' : '')}
                onClick={onHideSidebar}
            >
                <div className="email-sidebar">
                    {/* Compose button */}
                    <EmailComposeButton onComposeClick={onComposeClick} />

                    {/* Folders */}
                    <EmailFolders
                        activeFolder={params.folderId}
                        onFolderClick={onFolderClick}
                        emailCounts={emailCounts}
                        onClose={onHideSidebar}
                    />

                    {/* Labels */}
                    <EmailLabelIndex
                        labels={labels}
                        onCreateClick={() => onShowCreateLabelDialog()}
                        onDeleteLabelClick={onDeleteLabelClick}
                        onEditLabelClick={onEditLabelClick}
                    />
                </div>
            </div>

            {/* Main section (email list or email details) */}
            <section className="email-index-main">
                {params.emailId ? (
                    <Outlet context={[labels]} />
                ) : (
                    <>
                        {/* Top bar for email list */}
                        <EmailListTopbar
                            emails={emailsData.emails}
                            selectedEmailIds={selectedEmailIds}
                            labels={labels}
                            folderId={params.folderId}
                            onMultiSelectorChange={onMultiSelectorChange}
                            onDeleteClick={onDeleteSelectedEmailsClick}
                            updateEmails={updateEmails}
                            updateLabelsForEmails={updateLabelsForEmails}
                        />

                        {/* Email list */}
                        <EmailList
                            emailsData={{ ...emailsData, selectedEmailIds }}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={(email) =>
                                deleteEmailsByIds([email.id])
                            }
                            onEmailClick={onEmailClick}
                            onEmailCheckboxClick={onEmailCheckboxClick}
                        />
                        <div className="email-list-bottom"></div>
                    </>
                )}
            </section>

            {/* Compose dialog */}
            {searchParams.get('compose') !== null && (
                <EmailCompose
                    onCloseClick={onEmailComposeCloseClick}
                    onDeleteDraft={onDeleteDraft}
                />
            )}

            {/* Create label dialog */}
            {showCreateLabelDialog && (
                <EmailLabelCreate
                    label={selectedLabel}
                    onCloseClick={onHideCreateLabelDialog}
                    onSaveClick={onSaveLabelClick}
                />
            )}
        </section>
    )
}
