import { Link } from 'react-router-dom'

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
            <img
                className="email-preview-star-img"
                src={
                    'imgs/' +
                    (email.isStarred ? 'starred.svg' : 'unstarred.svg')
                }
                onClick={onStarClick}
            />
            {/* Link to email details */}
            <Link className="email-preview-link" to={`/email/${email.id}`}>
                {/* Subject */}
                <div className="email-preview-subject">{email.subject}</div>
            </Link>
            {/* Actions */}
            <div className="email-preview-actions">
                {/* Delete */}
                <img
                    className="email-preview-action-delete"
                    src="imgs/garbage-bin.svg"
                    alt="Delete"
                    onClick={() => onDeleteEmail(email.id)}
                />
            </div>
        </article>
    )
}
