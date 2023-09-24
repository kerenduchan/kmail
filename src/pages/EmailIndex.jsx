import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'
import { Logo } from '../cmps/Logo'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'
import { getEmailFilterFromParams, sanitizeFilter } from '../util'
import { emailService } from '../services/email.service'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'
import { EmailCompose } from './EmailCompose'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [emailCounts, setEmailCounts] = useState(null)
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filter, setFilter] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    // params and search params are the single source of truth for the filter
    useEffect(() => {
        setFilter(getEmailFilterFromParams(params, searchParams))
    }, [params, searchParams])

    useEffect(() => {
        if (filter !== null) {
            loadEmails()
        }
    }, [filter])

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

    async function loadEmails() {
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
            // edit draft
            setSearchParams((prev) => {
                return { ...prev, compose: emailId }
            })
        } else {
            // view email details, while retaining the search params
            navigate({
                pathname: `/email/${params.folderId}/${emailId}`,
                search: `?${createSearchParams(searchParams)}`,
            })
        }
    }

    function onHamburgerMenuClick() {
        setShowMenu((prev) => !prev)
    }

    if (!emails || !emailCounts) return <div>Loading..</div>

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
                {params.emailId ? (
                    <Outlet />
                ) : (
                    <>
                        <div className="email-list-top"></div>
                        <EmailList
                            emails={emails}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={onDeleteEmail}
                            onEmailClick={onEmailClick}
                        />
                        <div className="email-list-bottom"></div>
                    </>
                )}
            </section>
            {/* Compose modal */}
            {searchParams.get('compose') !== null && <EmailCompose />}
        </section>
    )
}
