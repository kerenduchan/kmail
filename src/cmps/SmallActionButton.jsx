import { forwardRef } from 'react'
import { Tooltip } from '@chakra-ui/react'

export const SmallActionButton = forwardRef(function (
    { type, label, onClick, className },
    ref
) {
    const types = {
        hamburger: 'imgs/hamburger-menu.svg',
        edit: 'imgs/edit.svg',
    }

    function getLabelByType(type) {
        switch (type) {
            case 'delete':
                return 'Delete'
            case 'unread':
                return 'Mark as unread'
            case 'read':
                return 'Mark as read'
            case 'unstarred':
                return 'Remove star'
            case 'starred':
                return 'Add star'
            case 'back':
                return 'Go back'
            case 'checked':
                return 'Selected'
            case 'unchecked':
                return 'Not selected'
            case 'create':
                return 'Create'
            case 'close':
                return 'Close'
            case 'edit':
                return 'Edit'
            case 'label':
                return 'Labels'
        }
        return ''
    }

    return (
        <Tooltip label={label ? label : getLabelByType(type)}>
            <button
                ref={ref}
                type="button"
                className={`small-action-btn small-action-btn-${type} ${
                    className ? ` ${className}` : ''
                }`}
                onClick={onClick}
            >
                <img className={`icon-${type}`} src={types[type]} />
            </button>
        </Tooltip>
    )
})
