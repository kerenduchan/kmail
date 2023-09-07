import { useState, useEffect } from 'react'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// services
import { emailService } from '../services/email.service'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filter, setFilter] = useState(emailService.getDefaultFilter())

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

    return (
        <section className="email-index">
            <EmailSidebar />
            <section className="email-index-main">
                <EmailFilter filter={filter} onSetFilter={onSetFilter} />
                <EmailList
                    emails={emails}
                    onUpdateEmail={onUpdateEmail}
                    onDeleteEmail={onDeleteEmail}
                />
            </section>
        </section>
    )
}
