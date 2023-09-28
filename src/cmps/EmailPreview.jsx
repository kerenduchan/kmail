import { formatDateConcise } from '../util'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailPreview({
    isSelected,
    email,
    folder,
    onEmailClick,
    onUpdateEmail,
    onDeleteEmail,
    onEmailCheckboxClick,
}) {
    function onToggleField(field) {
        const emailAfterUpdate = {
            ...email,
            [field]: !email[field],
        }
        onUpdateEmail(emailAfterUpdate)
    }

    return (
        <article
            className={
                'email-preview' +
                (email.isRead ? ' read' : '') +
                (isSelected ? ' selected' : '')
            }
        >
            {/* Selected checkbox */}
            <div
                className={
                    'email-preview-checkbox' + (isSelected ? ' checked' : '')
                }
                onClick={() => onEmailCheckboxClick(email.id, isSelected)}
            />
            {/* Star */}
            <SmallActionButton
                type={email.isStarred ? 'starred' : 'unstarred'}
                className="email-preview-star"
                onClick={() => onToggleField('isStarred')}
            />
            {/* Link to email details */}
            <div
                className="email-preview-link"
                onClick={() => onEmailClick(email.id)}
            />
            {/* First Column (From/To/Draft) */}
            <FirstColumn folder={folder} email={email} />
            {/* Subject */}
            <div className="email-preview-subject">
                {email.subject || '(no subject)'}
            </div>
            {/* Sent at */}
            <div className="email-preview-sent-at">
                {folder == 'drafts' ? '' : formatDateConcise(email.sentAt)}
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
                    onClick={() => onToggleField('isRead')}
                />
            </div>
        </article>
    )
}

// dynamic component for first column depending on the folder
function FirstColumn({ folder, email }) {
    switch (folder) {
        case 'sent':
            return (
                <div className="email-preview-first-column">To: {email.to}</div>
            )
        case 'drafts':
            return (
                <div className="email-preview-first-column email-preview-draft">
                    Draft
                </div>
            )
        default:
            return (
                <div className="email-preview-first-column">{email.from}</div>
            )
    }
}
