import { EmailPreview } from './EmailPreview'

export function EmailList({
    emailsData,
    labels,
    onUpdateEmail,
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
                        folder={emailsData.folder}
                        email={email}
                        labels={labels}
                        onUpdateEmail={onUpdateEmail}
                        onDeleteEmail={onDeleteEmail}
                        onEmailClick={onEmailClick}
                        onEmailCheckboxClick={onEmailCheckboxClick}
                    />
                </li>
            ))}
        </ul>
    )
}
