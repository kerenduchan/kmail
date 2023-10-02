import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { EmailCompose } from './EmailCompose'
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
import { EmailLabelIndex } from '../cmps/email-label/EmailLabelIndex'
import { EmailLabelCreate } from '../cmps/email-label/EmailLabelCreate'
import { Logo } from '../cmps/Logo'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'
import { EmailListTopbar } from '../cmps/EmailListTopbar'

import { emailService } from '../services/email.service'
import { getEmailFilterFromParams, sanitizeFilter } from '../util'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'
import { labelService } from '../services/label.service'

export function EmailIndex() {
    const [emailsData, setEmailsData] = useState(null)
    const [selectedEmailIds, setSelectedEmailIds] = useState([])
    const [areAllSelectedEmailsRead, setAreAllSelectedEmailsRead] =
        useState(false)
    const [emailCounts, setEmailCounts] = useState(null)
    const [labels, setLabels] = useState(null)
    const [selectedLabel, setSelectedLabel] = useState(null)
    const [showCreateLabelDialog, setShowCreateLabelDialog] = useState(false)
    const [multiSelectorState, setMultiSelectorState] = useState('none')
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filter, setFilter] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // params and search params are the single source of truth for the filter
    useEffect(() => {
        setFilter(getEmailFilterFromParams(params, searchParams))
        loadLabels()
    }, [params, searchParams])

    useEffect(() => {
        if (filter !== null) {
            loadEmails()
        }
    }, [filter])

    useEffect(() => {
        if (selectedEmailIds.length === 0) {
            setMultiSelectorState('none')
        } else if (selectedEmailIds.length === emailsData.emails.length) {
            setMultiSelectorState('all')
        } else {
            setMultiSelectorState('some')
        }

        updateAreAllSelectedEmailsRead()
    }, [selectedEmailIds])

    useEffect(() => {
        updateAreAllSelectedEmailsRead()
    }, [emailsData])

    function onFolderClick(folder) {
        hideUserMsg()
        setSelectedEmailIds([])
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

    function onComposeClick() {
        hideUserMsg()
        // open the compose dialog, while staying in the same folder and
        // retaining the search params
        setSearchParams((prev) => {
            prev.set('compose', 'new')
            return prev
        })
    }

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

    async function onUpdateEmail(email) {
        hideUserMsg()
        try {
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            showErrorMsg('Failed to update email', err)
        }
    }

    function onEmailComposeCloseClick() {
        // close the compose dialog
        setSearchParams((prev) => {
            prev.delete('compose')
        })
        loadEmails()
    }

    async function onDeleteDraft(emailId) {
        if (emailId !== null) {
            try {
                await emailService.remove(emailId)
                showSuccessMsg('Draft discarded.')
            } catch (err) {
                showErrorMsg('Failed to discard draft.')
            }
            loadEmails()
        }
        onEmailComposeCloseClick()
    }

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
        } catch (err) {
            showErrorMsg('Error loading emails' + err)
        }
    }

    async function loadLabels() {
        try {
            const labels = await labelService.getAllLabels()
            setLabels(labels)
        } catch (err) {
            showErrorMsg('Error loading labels' + err)
        }
    }

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

    function onEmailCheckboxClick(emailId, isChecked) {
        if (isChecked) {
            // deselect the email
            setSelectedEmailIds((prev) => prev.filter((id) => id != emailId))
        } else {
            // select the email
            setSelectedEmailIds((prev) => prev.concat([emailId]))
        }
    }

    function onHamburgerMenuClick() {
        setShowMenu((prev) => !prev)
    }

    function onEmailFoldersClose() {
        setShowMenu(false)
    }

    function onMultiSelectorChange(state) {
        switch (state) {
            case 'none':
                setSelectedEmailIds([])
                break
            case 'all':
                setSelectedEmailIds(emailsData.emails.map((e) => e.id))
                break
        }
    }

    async function onDeleteSelectedEmailsClick() {
        await deleteEmailsByIds(selectedEmailIds)
        setSelectedEmailIds([])
    }

    async function onUpdateSelectedEmails(fieldsToUpdate) {
        let msg = ''
        if (fieldsToUpdate.isRead !== undefined) {
            if (selectedEmailIds.length === 1) {
                msg = emailsData.folder == 'drafts' ? 'Draft' : 'Email'
            } else {
                msg =
                    `${selectedEmailIds.length} ` +
                    (emailsData.folder == 'drafts' ? 'drafts' : 'emails')
            }
            msg +=
                ' marked as ' +
                (fieldsToUpdate.isRead ? 'read' : 'unread') +
                '.'
        }
        updateManyEmails(selectedEmailIds, fieldsToUpdate, msg)
    }

    async function onSaveLabelClick(label) {
        if (label.id) {
            await labelService.updateLabel(label)
        } else {
            await labelService.createLabel(label)
        }
        onHideCreateLabelDialog()
        await loadLabels()
        showSuccessMsg(
            `Label '${label.name}' ` + (label.id ? 'updated.' : 'created.')
        )
    }

    async function onDeleteLabelClick(label) {
        await labelService.deleteLabel(label.id)
        await loadLabels()
        showSuccessMsg(`Label '${label.name}' deleted.`)
    }

    async function onEditLabelClick(label) {
        setSelectedLabel(label)
        hideUserMsg()
        setShowCreateLabelDialog(true)
    }

    function onHideCreateLabelDialog() {
        setShowCreateLabelDialog(false)
        setSelectedLabel(null)
    }

    function onShowCreateLabelDialog() {
        hideUserMsg()
        setShowCreateLabelDialog(true)
    }

    async function updateManyEmails(emailIds, fieldsToUpdate, msg) {
        const suffix = emailIds.length === 1 ? '' : 's'

        let emails = getEmailsByIds(emailIds)
        emails = emails.map((e) => ({ ...e, ...fieldsToUpdate }))

        hideUserMsg()
        try {
            await emailService.updateMany(emails)
            showSuccessMsg(msg)
            await loadEmails()
        } catch (err) {
            showErrorMsg(`Failed to update email${suffix}`, err)
        }
    }

    async function deleteEmailsByIds(emailIds) {
        const suffix = emailIds.length === 1 ? '' : 's'

        if (params.folderId == 'bin') {
            // delete emails forever
            try {
                await emailService.deleteEmailsByIds(emailIds)
                showSuccessMsg(`Email${suffix} deleted forever.`)
            } catch (err) {
                showErrorMsg(`Failed to delete email${suffix} forever.`)
            }
        } else {
            // move emails to bin
            try {
                const emails = getEmailsByIds(emailIds)
                emails.forEach((e) => {
                    e.deletedAt = Date.now()
                })
                await emailService.updateMany(emails)
                showSuccessMsg(
                    filter.folder == 'drafts'
                        ? `Draft${suffix} discarded.`
                        : `Email${suffix} moved to Bin.`
                )
            } catch (err) {
                showErrorMsg(
                    filter.folder == 'drafts'
                        ? `Failed to discard draft${suffix}.`
                        : `Failed to move email${suffix} to Bin.`
                )
            }
        }
        await loadEmails()
    }

    function getEmailsByIds(emailIds) {
        if (emailsData === null) {
            return []
        }
        return emailsData.emails.filter((e) => emailIds.includes(e.id))
    }

    function updateAreAllSelectedEmailsRead() {
        const emails = getEmailsByIds(selectedEmailIds)
        setAreAllSelectedEmailsRead(emails.every((e) => e.isRead === true))
    }

    if (!emailsData || !emailCounts) return <div>Loading..</div>

    return (
        <section className="email-index">
            <SmallActionButton
                className="hamburger-menu-button"
                type="hamburger"
                onClick={onHamburgerMenuClick}
            />
            <Logo />

            {/* Filter */}
            <EmailFilter filter={filter} onChange={onFilterChange} />

            {/* Sidebar (or menu on mobile) */}
            <div
                className={'email-sidebar-bg' + (showMenu ? ' visible' : '')}
                onClick={onEmailFoldersClose}
            >
                <div className="email-sidebar">
                    <EmailComposeButton onComposeClick={onComposeClick} />
                    <EmailFolders
                        activeFolder={params.folderId}
                        onFolderClick={onFolderClick}
                        emailCounts={emailCounts}
                        onClose={onEmailFoldersClose}
                    />
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
                    <Outlet />
                ) : (
                    <>
                        <EmailListTopbar
                            multiSelectorState={multiSelectorState}
                            onMultiSelectorChange={onMultiSelectorChange}
                            onDeleteClick={onDeleteSelectedEmailsClick}
                            onUpdateSelectedEmails={onUpdateSelectedEmails}
                            readButtonToShow={!areAllSelectedEmailsRead}
                        />
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
