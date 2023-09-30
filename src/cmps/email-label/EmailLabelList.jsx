import { EmailLabelPreview } from './EmailLabelPreview'

export function EmailLabelList({ labels }) {
    return (
        <ul className="email-labels-list">
            {labels.map((label) => (
                <li key={label.id}>
                    <EmailLabelPreview label={label} />
                </li>
            ))}
        </ul>
    )
}
