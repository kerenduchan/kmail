import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
import { Logo } from '../cmps/Logo'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'
import {
    getEmailFilterFromParams,
    sanitizeFilter,
    getDefaultFilter,
} from '../util'
import { emailService } from '../services/email.service'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [emailCounts, setEmailCounts] = useState(null)
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filter, setFilter] = useState(
        getEmailFilterFromParams(params, searchParams)
    )
    const [showMenu, setShowMenu] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const firstTime = useRef(true)

    useEffect(() => {
        if (firstTime.current) {
            firstTime.current = false
            return
        }
        setSearchParams(sanitizeFilter(filter))
        loadEmails()
    }, [filter])

    function onFolderClick(folder) {
        hideUserMsg()
        setFilter({ ...getDefaultFilter(), folder })
        navigate(`/email/${folder}`)
    }

    function onComposeClick() {
        hideUserMsg()
        navigate(`/email/${params.folderId}/compose`)
    }

    function onFilterChange(fieldsToUpdate) {
        setFilter((prev) => ({ ...prev, ...fieldsToUpdate }))
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

    // Either move the email to the bin or delete it forever if it's already
    // in the bin.
    async function onDeleteEmail(email) {
        if (email.deletedAt !== null) {
            try {
                // permanently delete
                await emailService.remove(email.id)
                await loadEmails()
                showSuccessMsg('Email deleted forever.')
            } catch (err) {
                showErrorMsg('Failed to delete email forever.')
            }
        } else {
            try {
                // move to bin
                email.deletedAt = Date.now()
                await emailService.save(email)
                await loadEmails()
                showSuccessMsg('Email moved to Bin.')
            } catch (err) {
                showErrorMsg('Failed to move email to Bin.')
            }
        }
    }

    async function onMarkEmailAsReadOrUnread(emailId, isRead) {
        hideUserMsg()
        try {
            let email = emails.data.filter((e) => e.id == emailId)
            if (email.length != 1) {
                showErrorMsg(
                    'Failed to mark email as ' + (isRead ? 'read' : 'unread'),
                    `Email with ID=${emailId} not found`
                )
                return
            }
            email = email[0]
            email.isRead = isRead
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            showErrorMsg(
                'Failed to mark email as ' + (isRead ? 'read' : 'unread'),
                err
            )
        }
    }

    async function loadEmails() {
        console.log('loadEmails')
        try {
            let [emailCounts, emails] = await Promise.all([
                emailService.getEmailCountsPerFolder(),
                emailService.query(filter),
            ])
            setEmails({
                data: emails,
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
            navigate(`/email/${params.folderId}/compose/${emailId}`)
        } else {
            navigate(`/email/${params.folderId}/${emailId}`)
        }
    }

    function onHamburgerMenuClick() {
        setShowMenu((prev) => !prev)
    }

    if (!emails || !emailCounts) return <div>Loading..</div>

    const showOutlet = location.pathname.includes('compose') || params.emailId

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
                className={showMenu ? '' : 'hide'}
                activeFolder={params.folderId}
                onFolderClick={onFolderClick}
                emailCounts={emailCounts}
            />
            <section className="email-index-main">
                {showOutlet ? (
                    <Outlet />
                ) : (
                    <>
                        <div className="email-list-top"></div>
                        <EmailList
                            emails={emails}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={onDeleteEmail}
                            onEmailClick={onEmailClick}
                            onMarkEmailAsReadOrUnread={
                                onMarkEmailAsReadOrUnread
                            }
                        />
                        <div className="email-list-bottom"></div>
                    </>
                )}
            </section>
        </section>
    )
}
