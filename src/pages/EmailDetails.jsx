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
            {/* Actions */}
            <section className="email-details-actions">
                {/* Back */}
                <Link to="/email">
                    <button className="email-details-action-back small-action-btn">
                        <img src="imgs/left-arrow.svg" alt="Back" />
                    </button>
                </Link>
                {/* Delete */}
                <button
                    className="email-details-action-delete small-action-btn"
                    onClick={onDeleteEmail}
                >
                    <img src="imgs/garbage-bin.svg" alt="Delete" />
                </button>
                {/* Mark as unread */}
                <button onClick={onMarkEmailAsUnread}>Mark as unread</button>
            </section>
            {/* Email Contents */}
            <section className="email-details-content">
                {/* Email Subject */}
                <header className="email-details-subject">
                    {email.subject}
                </header>
                <table className="email-details-metadata">
                    <tbody>
                        <tr className="email-details-from">
                            <td className="email-details-metadata-label">
                                From:
                            </td>
                            <td>{email.from}</td>
                        </tr>
                        <tr className="email-details-to">
                            <td className="email-details-metadata-label">
                                To:
                            </td>
                            <td>{email.to}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Email Body */}
                <article className="email-details-body">{email.body}</article>
            </section>
        </section>
    )
}
