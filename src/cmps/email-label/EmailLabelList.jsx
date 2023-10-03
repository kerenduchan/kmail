import { useEffect, useState } from 'react'
import { EmailLabelPreview } from './EmailLabelPreview'
import { useNavigate, useParams } from 'react-router'

export function EmailLabelList({
    labels,
    onDeleteLabelClick,
    onEditLabelClick,
}) {
    const [selectedLabelId, setSelectedLabelId] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const found = labels.filter((l) => l.name == params.folderId)
        if (found.length === 1) {
            // the current folderId is a label
            setSelectedLabelId(found[0].id)
        }
    }, [params])

    function onLabelClick(label) {
        navigate(`/email/${label.name}`)
    }

    return (
        <ul className="email-label-list">
            {labels.map((label) => (
                <li key={label.id}>
                    <EmailLabelPreview
                        label={label}
                        isSelected={selectedLabelId === label.id}
                        onClick={() => onLabelClick(label)}
                        onEditClick={() => onEditLabelClick(label)}
                        onDeleteClick={() => onDeleteLabelClick(label)}
                    />
                </li>
            ))}
        </ul>
    )
}
