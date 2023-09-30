import { useState } from 'react'
import { EmailLabelPreview } from './EmailLabelPreview'

export function EmailLabelList({ labels }) {
    const [selectedLabelId, setSelectedLabelId] = useState(null)

    function onLabelClick(labelId) {
        setSelectedLabelId(labelId)
    }

    return (
        <ul className="email-label-list">
            {labels.map((label) => (
                <li key={label.id}>
                    <EmailLabelPreview
                        label={label}
                        isSelected={selectedLabelId === label.id}
                        onClick={() => onLabelClick(label.id)}
                    />
                </li>
            ))}
        </ul>
    )
}
