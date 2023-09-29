import { SmallActionButton } from './SmallActionButton'

export function EmailLabels({ labels, onCreateClick }) {
    return (
        <div className="email-labels">
            <div className="email-labels-title">Labels</div>
            <div className="email-labels-create-btn-container">
                <SmallActionButton type="create" onClick={onCreateClick} />
            </div>
            <div className="email-labels-list">
                {labels.map((label) => (
                    <div key={label.id}>{label.name}</div>
                ))}
            </div>
        </div>
    )
}
