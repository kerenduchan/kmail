import { useState } from 'react'
import { MultiSelector } from '../MultiSelector'
import { SmallActionButton } from '../SmallActionButton'

export default function EmailLabelApplyMenu({
    show,
    labels,
    emails,
    updateEmails,
    toggleShowLabelMenu,
}) {
    function onToggleLabel(labelId, close = false) {
        const state = getLabelState(labelId)
        let emailsToUpdate = null
        if (state == 'none') {
            // Add label to all emails
            emailsToUpdate = emails.map((e) => ({
                ...e,
                labelIds: e.labelIds.concat(labelId),
            }))
        } else if (state == 'all') {
            // Remove label from all emails
            emailsToUpdate = emails.map((e) => ({
                ...e,
                labelIds: e.labelIds.filter((l) => l.id !== labelId),
            }))
        } else {
            // state is 'some'. Add label to all emails that don't already have
            // it
            emailsToUpdate = emails
                .filter((e) => !e.labelIds.includes(labelId))
                .map((e) => ({
                    ...e,
                    labelIds: e.labelIds.concat(labelId),
                }))
        }
        updateEmails(emailsToUpdate)
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

    return (
        <div>
            <SmallActionButton type="label" onClick={toggleShowLabelMenu} />

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
