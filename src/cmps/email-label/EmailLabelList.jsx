import { EmailLabelPreview } from './EmailLabelPreview'

export function EmailLabelList({
    labels,
    activeFolderId,
    onLabelClick,
    onDeleteLabelClick,
    onEditLabelClick,
}) {
    return (
        <ul className="email-label-list">
            {labels.map((label) => (
                <li key={label.id}>
                    <EmailLabelPreview
                        label={label}
                        isSelected={activeFolderId == label.name}
                        onClick={() => onLabelClick(label)}
                        onEditClick={() => onEditLabelClick(label)}
                        onDeleteClick={() => onDeleteLabelClick(label)}
                    />
                </li>
            ))}
        </ul>
    )
}
