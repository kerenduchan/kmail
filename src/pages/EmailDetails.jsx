import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import { formatDateVerbose, getContainingFolder } from '../util'
import { SmallActionButton } from '../cmps/SmallActionButton'

// services
import { emailService } from '../services/email.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function EmailDetails() {
    const [email, setEmail] = useState(null)
    const [sentAtStr, setSentAtStr] = useState('')
    const intervalId = useRef(null)

    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        loadEmailAndMarkAsRead()
    }, [params.emailId])

    useEffect(() => {
        if (!email) {
            return
        }
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }
        setSentAtStr(formatDateVerbose(email.sentAt))
        // refresh sentAtStr every minute
        const id = setInterval(() => {
            setSentAtStr(formatDateVerbose(email.sentAt))
        }, 60000)
        intervalId.current = id

        return () => {
            clearInterval(intervalId.current)
        }
    }, [email])

    // Either move the email to the bin or delete it forever if it's already
    // in the bin.
    async function onDeleteEmail() {
        if (email.deletedAt !== null) {
            try {
                // permanently delete
                await emailService.remove(email.id)
                navigateUp()
                showSuccessMsg('Email deleted forever.')
            } catch (err) {
                showErrorMsg('Failed to delete email forever.')
            }
        } else {
            try {
                // move to bin
                email.deletedAt = Date.now()
                await emailService.save(email)
                navigateUp()
                showSuccessMsg('Email moved to Bin.')
            } catch (err) {
                showErrorMsg('Failed to move email to Bin.')
            }
        }
    }

    async function onMarkEmailAsUnread() {
        try {
            let updatedEmail = { ...email, isRead: false }
            await emailService.save(updatedEmail)
            navigateUp()
        } catch (err) {
            console.log('Had issues marking email as unread', err)
        }
    }

    // navigate to the containing folder, while retaining the
    // search params
    function navigateUp() {
        navigate({
            pathname: getContainingFolder(location.pathname),
            search: location.search,
        })
    }

    async function loadEmailAndMarkAsRead() {
        try {
            let tmpEmail = await emailService.getById(params.emailId)
            tmpEmail = { ...tmpEmail, isRead: true }
            await emailService.save(tmpEmail)
            setEmail(tmpEmail)
        } catch (err) {
            navigateUp()
            console.error('Had issues loading email or marking it as read', err)
        }
    }

    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            {/* Actions */}
            <section className="email-details-actions">
                {/* Back */}
                <SmallActionButton type="back" onClick={navigateUp} />

                {/* Delete */}
                <SmallActionButton type="delete" onClick={onDeleteEmail} />
                {/* Mark as unread */}
                <SmallActionButton
                    type="unread"
                    onClick={onMarkEmailAsUnread}
                />
            </section>

            {/* Email Contents */}
            <section className="email-details-content">
                {/* Email Subject */}
                <header className="email-details-header">
                    <div className="email-details-subject">{email.subject}</div>
                    <div className="email-details-sent-at">{sentAtStr}</div>
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
                <article className="email-details-body">
                    <pre>{email.body}</pre>
                </article>
            </section>
        </section>
    )
}
