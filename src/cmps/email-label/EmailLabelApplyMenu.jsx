import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useState } from 'react'
import { MultiSelector } from '../MultiSelector'

export default function EmailLabelApplyMenu({ labels, emails, updateEmails }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

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

        if (close) {
            handleClose()
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

    return (
        <div>
            <Tooltip title="Label">
                <IconButton
                    aria-label="label"
                    id="label-button"
                    aria-controls={open ? 'label-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <img className="icon-label" />
                </IconButton>
            </Tooltip>
            <Menu
                id="label-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'label-button',
                }}
            >
                {labels.map((label) => {
                    return (
                        <MenuItem key={label.id}>
                            {/* Checkbox */}
                            <MultiSelector
                                state={getLabelState(label.id)}
                                onChange={() => onToggleLabel(label.id)}
                            />
                            <div onClick={() => onToggleLabel(label.id, true)}>
                                {label.name}
                            </div>
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    )
}
