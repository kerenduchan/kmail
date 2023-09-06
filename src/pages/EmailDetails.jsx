import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

// services
import { emailService } from '../services/email.service'

export function EmailDetails() {
    const [email, setEmail] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmailAndMarkAsRead()
    }, [params.emailId])

    async function onDeleteEmail() {
        try {
            await emailService.remove(params.emailId)
            navigate('/email')
        } catch (err) {
            console.log('Had issues deleting email', err)
        }
    }

    async function onMarkEmailAsUnread() {
        try {
            let updatedEmail = { ...email, isRead: false }
            await emailService.save(updatedEmail)
            navigate('/email')
        } catch (err) {
            console.log('Had issues marking email as unread', err)
        }
    }

    async function loadEmailAndMarkAsRead() {
        try {
            let tmpEmail = await emailService.getById(params.emailId)
            tmpEmail = { ...tmpEmail, isRead: true }
            await emailService.save(tmpEmail)
            setEmail(tmpEmail)
        } catch (err) {
            navigate('/email')
            console.error('Had issues loading email or marking it as read', err)
        }
    }

    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            <Link className="email-details-back" to="/email">
                Back
            </Link>
            <button onClick={onDeleteEmail}>Delete</button>
            <button onClick={onMarkEmailAsUnread}>Mark as Unread</button>
            <header className="email-details-subject">
                Subject: {email.subject}
            </header>
            <article className="email-details-body">{email.body}</article>
        </section>
    )
}
