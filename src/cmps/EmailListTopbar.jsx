import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorFilterChange,
    onDeleteSelectedEmailsClick,
}) {
    return (
        <div className="email-list-topbar">
            {/* Checkbox */}
            <MultiSelector
                state={multiSelectorState}
                onFilterChange={onMultiSelectorFilterChange}
            />
            {/* Actions */}
            <EmailListTopbarActions
                state={multiSelectorState}
                onDeleteClick={onDeleteSelectedEmailsClick}
            />
        </div>
    )
}

function EmailListTopbarActions({ state, onDeleteClick }) {
    if (state == 'none') {
        // TODO
        return <div></div>
    } else {
        return (
            <div className="email-list-topbar-actions">
                <SmallActionButton type="delete" onClick={onDeleteClick} />
                <SmallActionButton type="unread" />
            </div>
        )
    }
}
