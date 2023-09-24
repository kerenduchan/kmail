import { useEffect, useState } from 'react'
import { formatDateConcise } from '../util'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailPreview({
    email,
    folder,
    onEmailClick,
    onUpdateEmail,
    onDeleteEmail,
}) {
    const [firstColumn, setFirstColumn] = useState(undefined)

    useEffect(() => {
        switch (folder) {
            case 'sent':
                setFirstColumn(
                    <div className="email-preview-first-column">
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
                    <div className="email-preview-first-column">
                        {email.from}
                    </div>
                )
                break
        }
    }, [folder])

    function onToggleField(field) {
        const emailAfterUpdate = {
            ...email,
            [field]: !email[field],
        }
        onUpdateEmail(emailAfterUpdate)
    }

    return (
        <article className={'email-preview' + (email.isRead ? ' read' : '')}>
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
            {firstColumn}
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
