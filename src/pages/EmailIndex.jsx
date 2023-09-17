import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailFolders } from '../cmps/EmailFolders'

// services
import { emailService } from '../services/email.service'
import { strToNullableBool } from '../util'
import { AppHeader } from '../cmps/AppHeader'
import { EmailComposeButton } from '../cmps/EmailComposeButton'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filter, setFilter] = useState(emailService.getDefaultFilter())
    const [showMenu, setShowMenu] = useState(false)
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (filter.folder !== null) {
            loadEmails()
        }
    }, [filter])

    useEffect(() => {
        const qs = parseQueryString()

        // filter by folder
        setFilter((prevFilter) => ({
            ...prevFilter,
            folder: params.folderId,
            ...qs,
        }))
        setShowMenu(false)
    }, [params])

    function onFolderClick(folder) {
        navigate(`/email/${folder}`)
    }

    function onComposeClick() {
        navigate(`/email/${params.folderId}/compose`)
    }

    function onFilterChange(fieldsToUpdate) {
        const newFilter = { ...filter, ...fieldsToUpdate }
        const queryString = new URLSearchParams()

        if (newFilter.isRead !== null) {
            queryString.set('read', '' + newFilter.isRead)
        }
        if (newFilter.isStarred !== null) {
            queryString.set('starred', '' + newFilter.isStarred)
        }
        if (newFilter.searchString) {
            queryString.set('search', newFilter.searchString)
        }

        navigate({
            search: queryString.toString(),
        })
    }

    async function onUpdateEmail(email) {
        try {
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            console.log('Failed to star/unstar email', err)
        }
    }

    async function onDeleteEmail(email) {
        try {
            if (email.isDeleted) {
                // permanently delete
                await emailService.remove(email.id)
            } else {
                // move to bin
                email.isDeleted = true
                await emailService.save(email)
            }
            await loadEmails()
        } catch (err) {
            console.log('Had issues deleting email', err)
        }
    }

    async function onMarkEmailAsReadOrUnread(emailId, isRead) {
        try {
            let email = emails.data.filter((e) => e.id == emailId)
            if (email.length != 1) {
                console.error(
                    'Email cannot be marked as unread - not found. Email ID: ' +
                        emailId
                )
                return
            }
            email = email[0]
            email.isRead = isRead
            await emailService.save(email)
            await loadEmails()
        } catch (err) {
            console.log('Had issues marking email as unread', err)
        }
    }

    async function loadEmails() {
        try {
            const emails = await emailService.query(filter)
            setEmails({
                data: emails,
                folder: filter.folder,
            })
        } catch (err) {
            console.log('Had issues loading emails', err)
        }
    }

    function parseQueryString() {
        const queryString = new URLSearchParams(location.search)
        const searchString = queryString.get('search')

        return {
            isRead: strToNullableBool(queryString.get('read')),
            isStarred: strToNullableBool(queryString.get('starred')),
            searchString: searchString ? searchString : '',
        }
    }

    function onEmailClick(emailId) {
        if (params.folderId == 'drafts') {
            navigate(`/email/${params.folderId}/compose/${emailId}`)
        } else {
            navigate(`/email/${params.folderId}/${emailId}`)
        }
    }

    function onHamburgerMenuClick() {
        setShowMenu((prev) => !prev)
    }

    if (!emails) return <div>Loading..</div>

    const showOutlet = location.pathname.includes('compose') || params.emailId

    return (
        <section className="email-index">
            <SmallActionButton
                className="hamburger-menu-button"
                type="hamburger"
                onClick={onHamburgerMenuClick}
            />
            <AppHeader />
            <EmailFilter filter={filter} onChange={onFilterChange} />
            <EmailComposeButton onComposeClick={onComposeClick} />
            <EmailFolders
                className={showMenu ? '' : 'hide'}
                activeFolder={params.folderId}
                onFolderClick={onFolderClick}
            />
            <section className="email-index-main">
                {showOutlet ? (
                    <Outlet />
                ) : (
                    <>
                        <EmailList
                            emails={emails}
                            onUpdateEmail={onUpdateEmail}
                            onDeleteEmail={onDeleteEmail}
                            onEmailClick={onEmailClick}
                            onMarkEmailAsReadOrUnread={
                                onMarkEmailAsReadOrUnread
                            }
                        />
                    </>
                )}
            </section>
        </section>
    )
}
