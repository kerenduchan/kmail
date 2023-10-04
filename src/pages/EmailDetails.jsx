import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useOutletContext } from 'react-router-dom'

import {
    formatDateVerbose,
    getFolderNameById,
    getContainingFolder,
} from '../util/util'
import { SmallActionButton } from '../cmps/SmallActionButton'

// services
import { emailService } from '../services/email.service'
import {
    hideUserMsg,
    showErrorMsg,
    showSuccessMsg,
} from '../services/event-bus.service'
import EmailLabelApplyMenu from '../cmps/email-label/EmailLabelApplyMenu'
import {
    buildMsgsForDeleteEmailsForever,
    buildMsgsForMoveEmailsToBin,
} from '../util/msgBuilder'

export function EmailDetails() {
    const [sentAtStr, setSentAtStr] = useState('')
    const intervalId = useRef(null)

    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [email, labels, updateEmail, updateLabelsForEmails] = useOutletContext()

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
            const { success, error } = buildMsgsForDeleteEmailsForever(
                params.folderId,
                [email]
            )
            try {
                // permanently delete
                await emailService.remove(email.id)
                navigateUp()
                showSuccessMsg(success)
            } catch (e) {
                showErrorMsg(error, e)
            }
        } else {
            const { success, error } = buildMsgsForMoveEmailsToBin(
                params.folderId,
                [email]
            )
            try {
                // move to bin
                email.deletedAt = Date.now()
                await emailService.save(email)
                navigateUp()
                showSuccessMsg(success)
            } catch (e) {
                showErrorMsg(error, e)
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

    async function onRemoveLabel(label) {
        await updateLabelsForEmails(
            [email],
            [
                {
                    label,
                    isAdd: false,
                },
            ]
        )
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
            //            let tmpEmail = await emailService.getById(params.emailId)
            //            tmpEmail = { ...tmpEmail, isRead: true }
            //            await emailService.save(tmpEmail)
            //            setEmail(tmpEmail)
        } catch (err) {
            navigateUp()
            console.error('Had issues loading email or marking it as read', err)
        }
    }

    if (!email) return <div className="email-details-loading">Loading..</div>
    return (
        <section className="email-details">
            {/* Actions */}
            <section className="email-details-actions">
                {/* Back */}
                <SmallActionButton
                    type="back"
                    onClick={navigateUp}
                    title={`Back to ${getFolderNameById(params.folderId)}`}
                />

                {/* Delete */}
                <SmallActionButton type="delete" onClick={onDeleteEmail} />

                {/* Mark as unread */}
                <SmallActionButton
                    type="unread"
                    onClick={onMarkEmailAsUnread}
                />

                {/* Label as */}
                <EmailLabelApplyMenu
                    emails={[email]}
                    labels={labels}
                    updateLabelsForEmails={updateLabelsForEmails}
                />
            </section>

            {/* Email Contents */}
            <section className="email-details-content">
                <header className="email-details-header">
                    {/* Subject */}
                    <div className="email-details-subject">{email.subject}</div>

                    {/* Labels */}
                    <div className="email-details-labels">
                        {email.labels.map((l) => (
                            <div key={l.id} className="email-details-label">
                                <div className="email-details-label-name">
                                    {l.name}
                                </div>
                                <button
                                    className="email-details-label-delete"
                                    onClick={() => onRemoveLabel(l)}
                                ></button>
                            </div>
                        ))}
                    </div>

                    {/* Sent at */}
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
