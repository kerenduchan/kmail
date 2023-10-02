import { Tooltip } from '@mui/material'

export function SmallActionButton({ type, onClick, className, title }) {
    const types = {
        hamburger: 'imgs/hamburger-menu.svg',
        edit: 'imgs/edit.svg',
    }

    function getTitleByType(type) {
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
        }
        return ''
    }

    return (
        <Tooltip title={title || getTitleByType(type)}>
            <button
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
}
