import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// services
import { emailService } from '../services/email.service'
import { strToNullableBool } from '../util'

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
        // redirect /email => /email/inbox
        const pathnameArr = location.pathname.split('/').filter((p) => p.length)
        if (pathnameArr.length == 1) {
            navigate('/email/inbox')
            return
        }

        const qs = parseQueryString()
        if (
            pathnameArr.length == 2 &&
            ['inbox', 'sent', 'all'].includes(pathnameArr[1])
        ) {
            // filter by folder
            onSetFilter({ folder: pathnameArr[1], ...qs })
        }
    }, [location])

    function onFolderClick(folder) {
        navigate(`/email/${folder}`)
    }

    function onSetFilter(fieldsToUpdate) {
        setFilter((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }))
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
        let res = {
            isRead: strToNullableBool(queryString.get('read')),
            isStarred: strToNullableBool(queryString.get('starred')),
            searchStr: queryString.get('search'),
        }

        return Object.keys(res).forEach((key) =>
            res[key] === undefined ? delete res[key] : {}
        )
    }

    if (!emails) return <div>Loading..</div>

    const inner =
        location.pathname == '/email/compose' || params.emailId ? (
            <Outlet />
        ) : (
            <>
                <EmailFilter filter={filter} onChange={onSetFilter} />
                <EmailList
                    emails={emails}
                    onUpdateEmail={onUpdateEmail}
                    onDeleteEmail={onDeleteEmail}
                />
            </>
        )

    return (
        <section className="email-index">
            <EmailSidebar onFolderClick={onFolderClick} />
            <section className="email-index-main">{inner}</section>
        </section>
    )
}
