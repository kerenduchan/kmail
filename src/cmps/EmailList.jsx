import { EmailPreview } from './EmailPreview'

export function EmailList({
    emailsData,
    updateEmails,
    onDeleteEmail,
    onEmailClick,
    onEmailCheckboxClick,
}) {
    return (
        <ul className="email-list">
            {emailsData.emails.map((email) => (
                <li key={email.id}>
                    <EmailPreview
                        isSelected={emailsData.selectedEmailIds.includes(
                            email.id
                        )}
                        folderId={emailsData.folderId}
                        email={email}
                        updateEmails={updateEmails}
                        onDeleteEmail={onDeleteEmail}
                        onEmailClick={onEmailClick}
                        onEmailCheckboxClick={onEmailCheckboxClick}
                    />
                </li>
            ))}
        </ul>
    )
}
