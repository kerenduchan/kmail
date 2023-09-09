import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// services
import { emailService } from '../services/email.service'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filter, setFilter] = useState(emailService.getDefaultFilter())
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmails()
    }, [filter])

    useEffect(() => {
        const pathnameArr = location.pathname.split('/').filter((p) => p.length)
        console.log(pathnameArr)
        if (pathnameArr.length == 1) {
            navigate('/email/inbox')
        } else if (
            pathnameArr.length == 2 &&
            ['inbox', 'sent', 'all'].includes(pathnameArr[1])
        ) {
            setFilter((prev) => ({
                ...prev,
                folder: pathnameArr[1],
            }))
        }
    }, [location])

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
            setEmails((prevEmails) =>
                prevEmails.filter((e) => e.id !== emailId)
            )
        } catch (err) {
            console.log('Had issues deleting email', err)
        }
    }

    async function loadEmails() {
        try {
            const emails = await emailService.query(filter)
            setEmails(emails)
        } catch (err) {
            console.log('Had issues loading emails', err)
        }
    }

    if (!emails) return <div>Loading..</div>

    const inner =
        location.pathname == '/email/compose' || params.emailId ? (
            <Outlet />
        ) : (
            <>
                <EmailFilter filter={filter} onSetFilter={onSetFilter} />
                <EmailList
                    emails={emails}
                    onUpdateEmail={onUpdateEmail}
                    onDeleteEmail={onDeleteEmail}
                />
            </>
        )

    return (
        <section className="email-index">
            <EmailSidebar />
            <section className="email-index-main">{inner}</section>
        </section>
    )
}
