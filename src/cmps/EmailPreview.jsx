import { Link } from 'react-router-dom'

import { formatDate } from '../util'

const MAX_SUBJECT_LEN = 80

export function EmailPreview({ email, onUpdateEmail, onDeleteEmail }) {
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
            <Link className="email-preview-link" to={`/email/${email.id}`}>
                {/* From */}
                <div className="email-preview-from">{email.from}</div>
                {/* Subject */}
                <div className="email-preview-subject">{email.subject}</div>
                {/* Sent at */}
                <div className="email-preview-sent-at">
                    {formatDate(email.sentAt)}
                </div>
            </Link>
            {/* Actions */}
            <div className="email-preview-actions">
                {/* Delete */}
                <button
                    className="email-preview-action-delete small-action-btn"
                    onClick={() => onDeleteEmail(email.id)}
                >
                    <img src="imgs/garbage-bin.svg" alt="Delete" />
                </button>
            </div>
        </article>
    )
}
