import { useEffect, useState } from 'react'
import { formatDateConcise } from '../util'

const MAX_SUBJECT_LEN = 80

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
            <button
                className="email-preview-action-star small-action-btn"
                onClick={onStarClick}
            >
                <img
                    src={
                        'imgs/' +
                        (email.isStarred ? 'starred.svg' : 'unstarred.svg')
                    }
                    alt="Star"
                />
            </button>
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
                <button
                    className="email-preview-action-delete small-action-btn"
                    onClick={() => onDeleteEmail(email)}
                >
                    <img src="imgs/garbage-bin.svg" alt="Delete" />
                </button>
                {/* Mark as read/unread */}
                <button
                    className="small-action-btn"
                    onClick={() =>
                        onMarkEmailAsReadOrUnread(email.id, !email.isRead)
                    }
                >
                    <img
                        src={
                            'imgs/mail-' +
                            (email.isRead ? 'unread.svg' : 'read.svg')
                        }
                        alt={'Mark as ' + email.isRead ? 'unread' : 'read'}
                    />
                </button>
            </div>
        </article>
    )
}
