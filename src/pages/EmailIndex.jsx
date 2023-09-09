import { useState, useEffect } from 'react'
import { useParams, Outlet } from 'react-router'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// pages
import { EmailCompose } from './EmailCompose'

// services
import { emailService } from '../services/email.service'
import { Modal } from '../cmps/Modal'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filter, setFilter] = useState(emailService.getDefaultFilter())
    const [showCompose, setShowCompose] = useState(false)
    const params = useParams()

    useEffect(() => {
        loadEmails()
    }, [filter])

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

    const inner = params.emailId ? (
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
            <EmailSidebar onComposeClick={() => setShowCompose(true)} />
            <section className="email-index-main">{inner}</section>

            {/* Email Compose Modal */}
            <Modal
                show={showCompose}
                onClose={() => setShowCompose(false)}
                renderComponent={<EmailCompose />}
            />
        </section>
    )
}
