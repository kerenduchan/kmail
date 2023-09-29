import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { EmailCompose } from './EmailCompose'
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
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

export function EmailIndex() {
    const [emailsData, setEmailsData] = useState(null)
    const [selectedEmailIds, setSelectedEmailIds] = useState([])
    const [emailCounts, setEmailCounts] = useState(null)
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
    }, [selectedEmailIds])

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

    function onMultiSelectorFilterChange(filter) {
        switch (filter) {
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
                const emails = emailsData.emails.filter((e) =>
                    emailIds.includes(e.id)
                )
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

    if (!emailsData || !emailCounts) return <div>Loading..</div>

    return (
        <section className="email-index">
            <SmallActionButton
                className="hamburger-menu-button"
                type="hamburger"
                onClick={onHamburgerMenuClick}
            />
            <Logo />
            <EmailFilter filter={filter} onChange={onFilterChange} />
            <EmailComposeButton onComposeClick={onComposeClick} />
            <EmailFolders
                className={showMenu ? 'visible' : ''}
                activeFolder={params.folderId}
                onFolderClick={onFolderClick}
                emailCounts={emailCounts}
                onClose={onEmailFoldersClose}
            />
            <section className="email-index-main">
                {params.emailId ? (
                    <Outlet />
                ) : (
                    <>
                        <EmailListTopbar
                            multiSelectorState={multiSelectorState}
                            onMultiSelectorFilterChange={
                                onMultiSelectorFilterChange
                            }
                            onDeleteSelectedEmailsClick={
                                onDeleteSelectedEmailsClick
                            }
                        />
                        <EmailList
                            emailsData={{ ...emailsData, selectedEmailIds }}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={() => deleteEmailsByIds([email.id])}
                            onEmailClick={onEmailClick}
                            onEmailCheckboxClick={onEmailCheckboxClick}
                        />
                        <div className="email-list-bottom"></div>
                    </>
                )}
            </section>
            {/* Compose modal */}
            {searchParams.get('compose') !== null && (
                <EmailCompose
                    onCloseClick={onEmailComposeCloseClick}
                    onDeleteDraft={onDeleteDraft}
                />
            )}
        </section>
    )
}
