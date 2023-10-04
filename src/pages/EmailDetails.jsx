import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useOutletContext } from 'react-router-dom'

import {
    formatDateVerbose,
    getFolderNameById,
    getContainingFolder,
} from '../util/util'
import { SmallActionButton } from '../cmps/SmallActionButton'
import EmailLabelApplyMenu from '../cmps/email-label/EmailLabelApplyMenu'

// services

export function EmailDetails() {
    const [sentAtStr, setSentAtStr] = useState('')
    const intervalId = useRef(null)

    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [
        {
            email,
            labels,
            updateEmails,
            deleteEmailsByIds,
            updateLabelsForEmails,
        },
    ] = useOutletContext()

    const markAsReadTimeout = useRef(null)

    useEffect(() => {
        // silently mark the email as read if it's been open for over 2 seconds
        markAsReadTimeout.current = setTimeout(() => {
            updateEmails([email], 'isRead', true, true)
        }, 2000)

        return () => {
            clearTimeout(markAsReadTimeout.current)
        }
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
        await deleteEmailsByIds([email.id])
        navigateUp()
    }

    async function onMarkEmailAsUnread() {
        clearTimeout(markAsReadTimeout.current)
        await updateEmails([email], 'isRead', false)
        navigateUp()
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
