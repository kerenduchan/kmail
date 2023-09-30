export function EmailLabelPreview({ label, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={'email-label-preview' + (isSelected ? ' selected' : '')}
        >
            <div className="email-label-icon"></div>
            <div className="email-label-preview-name">{label.name}</div>
        </div>
    )
}
