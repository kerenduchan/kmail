import { formatDateConcise } from '../util'

const MAX_SUBJECT_LEN = 80

export function EmailPreview({
    email,
    showSentView,
    onEmailClick,
    onUpdateEmail,
    onDeleteEmail,
}) {
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
                {/* From (or To in Sent view */}
                <div className="email-preview-from">
                    {showSentView ? 'To: ' + email.to : email.from}
                </div>
                {/* Subject */}
                <div className="email-preview-subject">{email.subject}</div>
                {/* Sent at */}
                <div className="email-preview-sent-at">
                    {formatDateConcise(email.sentAt)}
                </div>
            </div>
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
