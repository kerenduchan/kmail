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
        loadEmail()
    }, [params.emailId])

    async function loadEmail() {
        try {
            const email = await emailService.getById(params.emailId)
            setEmail(email)
        } catch (err) {
            navigate('/email')
            console.error('Had issues loading email', err)
        }
    }

    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            <Link className="email-details-back" to="/email">
                Back
            </Link>
            <header className="email-details-subject">
                Subject: {email.subject}
            </header>
            <article className="email-details-body">{email.body}</article>
        </section>
    )
}
