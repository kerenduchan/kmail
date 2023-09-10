import { EmailPreview } from './EmailPreview'

export function EmailList({
    emails,
    onUpdateEmail,
    onDeleteEmail,
    onEmailClick,
    onMarkEmailAsReadOrUnread,
}) {
    return (
        <ul className="email-list">
            {emails.data.map((email) => (
                <li key={email.id}>
                    <EmailPreview
                        folder={emails.folder}
                        email={email}
                        onUpdateEmail={onUpdateEmail}
                        onDeleteEmail={onDeleteEmail}
                        onEmailClick={onEmailClick}
                        onMarkEmailAsReadOrUnread={onMarkEmailAsReadOrUnread}
                    />
                </li>
            ))}
        </ul>
    )
}
