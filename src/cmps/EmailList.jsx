import { EmailPreview } from './EmailPreview'

export function EmailList({
    emails,
    onUpdateEmail,
    onDeleteEmail,
    onEmailClick,
}) {
    return (
        <ul className="email-list">
            {emails.data.map((email) => (
                <li key={email.id}>
                    <EmailPreview
                        showSentView={emails.folder == 'sent'}
                        email={email}
                        onUpdateEmail={onUpdateEmail}
                        onDeleteEmail={onDeleteEmail}
                        onEmailClick={onEmailClick}
                    />
                </li>
            ))}
        </ul>
    )
}
