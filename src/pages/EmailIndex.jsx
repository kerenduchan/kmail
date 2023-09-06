import { useState, useEffect } from 'react'

// components
import { EmailFilter } from '../cmps/EmailFilter'
import { EmailList } from '../cmps/EmailList'
import { EmailSidebar } from '../cmps/EmailSidebar'

// services
import { emailService } from '../services/email.service'

export function EmailIndex() {
    const [emails, setEmails] = useState(null)

    useEffect(() => {
        loadEmails()
    }, [])

    async function loadEmails() {
        try {
            const emails = await emailService.query()
            console.log(emails)
            setEmails(emails)
        } catch (err) {
            console.log('Had issues loading emails', err)
        }
    }

    if (!emails) return <div>Loading..</div>

    return (
        <section className="email-index">
            <EmailSidebar />
            <section className="email-main">
                <EmailFilter />
                <EmailList emails={emails} />
            </section>
        </section>
    )
}
