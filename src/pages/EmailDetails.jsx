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

    async function loadEmailAndMarkAsRead() {
        try {
            let email = await emailService.getById(params.emailId)
            email = { ...email, isRead: true }
            await emailService.save(email)
            setEmail(email)
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
            <header className="email-details-subject">
                Subject: {email.subject}
            </header>
            <article className="email-details-body">{email.body}</article>
        </section>
    )
}
