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
    showProgressMsg,
    showSuccessMsg,
} from '../services/event-bus.service'
import { labelService } from '../services/label.service'
import { getEmailFilterFromParams, sanitizeFilter } from '../util/util'
import {
    buildMsgsForDeleteEmails,
    buildMsgsForDeleteLabel,
    buildMsgsForSaveLabel,
    buildMsgsForSendEmail,
    buildMsgsForUpdateEmails,
    buildMsgsForUpdateLabelsForEmails,
} from '../util/msgBuilder'
import useToggle from '../util/useToggle'

// The email index - main component for managing emails
export function EmailIndex() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    // The emails filter
    const [filter, setFilter] = useState(null)

    // All the emails and the ID of the folder currently being displayed.
    // They are bundled together in one state so that there won't be a flicker
    // in the first column of the email preview (from/to/draft) when switching
    // folders.
    const [emailsData, setEmailsData] = useState(null)

    // IDs of all selected emails.
    const [selectedEmailIds, setSelectedEmailIds] = useState([])

    /* For the sidebar =======================================================*/

    // Key is folder ID, value is email counts (total, unread) for the folder.
    // Needed for the folder counts in the sidebar.
    const [emailCounts, setEmailCounts] = useState(null)

    // Show/hide the sidebar (for mobile only)
    const [showSidebar, toggleShowSidebar, setShowSidebar] = useToggle(false)

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
    function onFolderClick(folderId) {
        hideUserMsg()
        // go to the clicked folder, while retaining only the compose part
        // of the search params
        const navigateArgs = {
            pathname: `/email/${folderId}`,
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
        const { success, error } = buildMsgsForDeleteEmails('drafts', [emailId])
        if (emailId !== null) {
            try {
                await emailService.deleteEmail(emailId)
                showSuccessMsg(success)
            } catch (err) {
                showErrorMsg(error)
            }
            loadEmails()
        }
        onEmailComposeCloseClick()
    }

    // handle send click from the email compose dialog
    async function onSendEmail(email) {
        hideUserMsg()
        const { progress, success, error } = buildMsgsForSendEmail()
        showProgressMsg(progress)
        try {
            await emailService.sendEmail(email)
            showSuccessMsg(success)
        } catch (e) {
            showErrorMsg(error, e)
        }
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
        toggleShowSidebar()
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
        const { progress, success, error } = buildMsgsForSaveLabel(label)
        onHideCreateLabelDialog()
        hideUserMsg()
        showProgressMsg(progress)
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
    }

    // Handle a click on the given label
    async function onLabelClick(label) {
        navigate(`/email/${label.name}`)
    }

    // Handle a click on the delete label button for the given label
    async function onDeleteLabelClick(label) {
        const { progress, success, error } = buildMsgsForDeleteLabel(label)
        hideUserMsg()
        showProgressMsg(progress)
        try {
            await emailService.removeLabelFromAllEmails(label.id)
            await loadEmails()
            await labelService.deleteLabel(label.id)
            await loadLabels()
            showSuccessMsg(success)
        } catch (e) {
            showErrorMsg(error, e)
        }
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
                emailService.getEmails(filter),
            ])
            setEmailsData({
                emails,
                folderId: filter.folderId,
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

    // Update all the given emails -
    // Change the given field to be the given value
    async function updateEmails(emails, field, value, silent = false) {
        const emailsToUpdate = emails.map((e) => ({
            ...e,
            [field]: value,
        }))
        const { progress, success, error } = buildMsgsForUpdateEmails(
            params.folderId,
            emailsToUpdate,
            field,
            value
        )
        if (!silent) {
            hideUserMsg()
            showProgressMsg(progress)
        }
        try {
            await emailService.updateEmails(emailsToUpdate)
            await loadEmails()
            if (!silent) {
                showSuccessMsg(success)
            }
        } catch (e) {
            showErrorMsg(error, e)
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
        const { progress, success, error } = buildMsgsForDeleteEmails(
            params.folderId,
            emailIds
        )
        hideUserMsg()
        showProgressMsg(progress)

        try {
            if (params.folderId == 'bin') {
                // Delete emails forever
                await emailService.deleteEmailsByIds(emailIds)
            } else {
                // Move emails to bin
                const emails = getEmailsByIds(emailIds)
                emails.forEach((e) => {
                    e.deletedAt = Date.now()
                })
                await emailService.updateEmails(emails)
            }
            await loadEmails()
            showSuccessMsg(success)
        } catch (e) {
            showErrorMsg(error, e)
        }
    }

    // Get emails by IDs
    function getEmailsByIds(emailIds) {
        if (emailsData === null) {
            return []
        }
        return emailsData.emails.filter((e) => emailIds.includes(e.id))
    }

    // get the email for the EmailDetails outlet, based on the URL params
    function getEmailForDetails() {
        return emailsData.emails.filter((e) => e.id === params.emailId)[0]
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
                        activeFolderId={params.folderId}
                        onFolderClick={onFolderClick}
                        emailCounts={emailCounts}
                        onClose={onHideSidebar}
                    />

                    {/* Labels */}
                    <EmailLabelIndex
                        labels={labels}
                        activeFolderId={params.folderId}
                        onLabelClick={onLabelClick}
                        onCreateLabelClick={() => onShowCreateLabelDialog()}
                        onDeleteLabelClick={onDeleteLabelClick}
                        onEditLabelClick={onEditLabelClick}
                    />
                </div>
            </div>

            {/* Main section (email list or email details) */}
            <section className="email-index-main">
                {params.emailId ? (
                    <Outlet
                        context={[
                            {
                                email: getEmailForDetails(),
                                labels,
                                updateEmails,
                                deleteEmailsByIds,
                                updateLabelsForEmails,
                                onLabelClick,
                            },
                        ]}
                    />
                ) : (
                    <>
                        {/* Top bar for email list */}
                        <EmailListTopbar
                            emails={emailsData.emails}
                            selectedEmailIds={selectedEmailIds}
                            labels={labels}
                            onMultiSelectorChange={onMultiSelectorChange}
                            onDeleteClick={onDeleteSelectedEmailsClick}
                            updateEmails={updateEmails}
                            updateLabelsForEmails={updateLabelsForEmails}
                        />

                        {/* Email list */}
                        <EmailList
                            emailsData={{ ...emailsData, selectedEmailIds }}
                            updateEmails={updateEmails}
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
                    onSendEmail={onSendEmail}
                />
            )}

            {/* Create label dialog */}
            {showCreateLabelDialog && (
                <EmailLabelCreate
                    label={selectedLabel}
                    labels={labels}
                    onCloseClick={onHideCreateLabelDialog}
                    onSaveClick={onSaveLabelClick}
                />
            )}
        </section>
    )
}
