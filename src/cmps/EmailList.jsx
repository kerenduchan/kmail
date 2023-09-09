import { EmailPreview } from './EmailPreview'

export function EmailList({
    emails,
    showSentView,
    onUpdateEmail,
    onDeleteEmail,
}) {
    return (
        <ul className="email-list">
            {emails.map((email) => (
                <li key={email.id}>
                    <EmailPreview
                        showSentView={showSentView}
                        email={email}
                        onUpdateEmail={onUpdateEmail}
                        onDeleteEmail={onDeleteEmail}
                    />
                </li>
            ))}
        </ul>
    )
}
