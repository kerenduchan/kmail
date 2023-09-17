import { useEffect, useState } from 'react'
import { formatDateConcise } from '../util'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailPreview({
    email,
    folder,
    onEmailClick,
    onUpdateEmail,
    onDeleteEmail,
    onMarkEmailAsReadOrUnread,
}) {
    const [firstColumn, setFirstColumn] = useState(undefined)

    useEffect(() => {
        switch (folder) {
            case 'sent':
                setFirstColumn(
                    <div className="email-preview-first-column email-preview-to">
                        To: {email.to}
                    </div>
                )
                break
            case 'drafts':
                setFirstColumn(
                    <div className="email-preview-first-column email-preview-draft">
                        Draft
                    </div>
                )
                break
            default:
                setFirstColumn(
                    <div className="email-preview-first-column email-preview-from">
                        {email.from}
                    </div>
                )
                break
        }
    }, [folder])

    function onStarClick() {
        const emailAfterUpdate = {
            ...email,
            isStarred: !email.isStarred,
        }
        onUpdateEmail(emailAfterUpdate)
    }

    return (
        <article className={'email-preview' + (email.isRead ? ' read' : '')}>
            {/* Star */}
            <SmallActionButton
                type={email.isStarred ? 'starred' : 'unstarred'}
                onClick={onStarClick}
            />
            {/* Link to email details */}
            <div
                className="email-preview-link"
                onClick={() => onEmailClick(email.id)}
            >
                {/* First Column (From/To/Draft) */}
                {firstColumn}
                {/* Subject */}
                <div className="email-preview-subject">{email.subject}</div>
                {/* Sent at */}
                <div className="email-preview-sent-at">
                    {folder == 'drafts' ? '' : formatDateConcise(email.sentAt)}
                </div>
            </div>
            {/* Actions */}
            <div className="email-preview-actions">
                {/* Delete */}
                <SmallActionButton
                    type="delete"
                    onClick={() => onDeleteEmail(email)}
                />
                {/* Mark as read/unread */}
                <SmallActionButton
                    type={email.isRead ? 'unread' : 'read'}
                    onClick={() =>
                        onMarkEmailAsReadOrUnread(email.id, !email.isRead)
                    }
                />
            </div>
        </article>
    )
}
