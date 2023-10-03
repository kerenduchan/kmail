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

    async function onToggleLabel(label) {
        // add label if it is applied to none/some, remove label if it is
        // applied to all
        const isAdd = getLabelState(label.id) != 'all'
        await updateLabelsForEmails(emails, [{ label, isAdd }])
        setShow(false)
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
                                onClick={() => onToggleLabel(label)}
                            />
                            <div onClick={() => onToggleLabel(label)}>
                                {label.name}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
