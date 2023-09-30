import { SmallActionButton } from '../SmallActionButton'

export function EmailLabelPreview({
    label,
    isSelected,
    onClick,
    onDeleteClick,
}) {
    return (
        <div
            onClick={onClick}
            className={'email-label-preview' + (isSelected ? ' selected' : '')}
        >
            <div className="email-label-icon"></div>
            <div className="email-label-preview-name">{label.name}</div>
            <div className="email-label-preview-actions">
                <SmallActionButton type="edit" />
                <SmallActionButton type="delete" onClick={onDeleteClick} />
            </div>
        </div>
    )
}
