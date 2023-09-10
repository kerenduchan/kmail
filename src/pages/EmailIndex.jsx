import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// services
import { emailService } from '../services/email.service'
import { nullableBoolToStr, strToNullableBool } from '../util'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filter, setFilter] = useState(emailService.getDefaultFilter())
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (filter.folder === null) {
            return
        }
        loadEmails()
    }, [filter])

    useEffect(() => {
        // redirect to inbox if no folder given or incorrect folder given
        if (
            !params.folderId ||
            !['inbox', 'sent', 'all', 'drafts'].includes(params.folderId)
        ) {
            navigate('/email/inbox')
            return
        }
        const qs = parseQueryString()

        // filter by folder
        setFilter((prevFilter) => ({
            ...prevFilter,
            folder: params.folderId,
            ...qs,
        }))
    }, [location])

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
            queryString.set('read', nullableBoolToStr(newFilter.isRead))
        }
        if (newFilter.isStarred !== null) {
            queryString.set('starred', nullableBoolToStr(newFilter.isStarred))
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

    async function onDeleteEmail(emailId) {
        try {
            await emailService.remove(emailId)
            await loadEmails()
        } catch (err) {
            console.log('Had issues deleting email', err)
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
        navigate(`/email/${params.folderId}/e/${emailId}`)
    }

    if (!emails) return <div>Loading..</div>

    const inner =
        location.pathname.includes('compose') || params.emailId ? (
            <Outlet />
        ) : (
            <>
                <EmailFilter filter={filter} onChange={onFilterChange} />
                <EmailList
                    emails={emails}
                    onUpdateEmail={onUpdateEmail}
                    onDeleteEmail={onDeleteEmail}
                    onEmailClick={onEmailClick}
                />
            </>
        )

    return (
        <section className="email-index">
            <EmailSidebar
                activeFolder={params.folderId}
                onFolderClick={onFolderClick}
                onComposeClick={onComposeClick}
            />
            <section className="email-index-main">{inner}</section>
        </section>
    )
}
