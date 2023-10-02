import { useState } from 'react'
import { MultiSelector } from '../MultiSelector'
import { SmallActionButton } from '../SmallActionButton'

export default function EmailLabelApplyMenu({
    labels,
    emails,
    updateLabelsForEmails,
}) {
    // Toggle for showing/hiding the apply labels menu
    const [show, setShow] = useState(false)

    async function onToggleLabel(labelId, close = false) {
        // add label if it is applied to none/some, remove label if it is
        // applied to all
        const isAddLabel = getLabelState(labelId) != 'all'
        await updateLabelsForEmails(emails, { [labelId]: isAddLabel })
        if (close) {
            setShow(false)
        }
    }

    function getLabelState(labelId) {
        if (emails.every((e) => e.labelIds.includes(labelId))) {
            return 'all'
        }
        if (emails.some((e) => e.labelIds.includes(labelId))) {
            return 'some'
        }
        return 'none'
    }

    // Show/hide the apply label menu in the top bar
    function toggleShow() {
        setShow((prev) => !prev)
    }

    return (
        <div>
            <SmallActionButton type="label" onClick={toggleShow} />

            <div className={`email-label-apply-menu${show ? ' visible' : ''}`}>
                <div className="email-label-apply-menu-title">Label as:</div>
                {labels.map((label) => {
                    return (
                        <div
                            className="email-label-apply-menu-item"
                            key={label.id}
                        >
                            {/* Checkbox */}
                            <MultiSelector
                                state={getLabelState(label.id)}
                                onClick={() => onToggleLabel(label.id)}
                            />
                            <div onClick={() => onToggleLabel(label.id, true)}>
                                {label.name}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
