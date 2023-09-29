import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorFilterChange,
}) {
    return (
        <div className="email-list-topbar">
            {/* Checkbox */}
            <MultiSelector
                state={multiSelectorState}
                onFilterChange={onMultiSelectorFilterChange}
            />
            {/* Actions */}
            <EmailListTopbarActions state={multiSelectorState} />
        </div>
    )
}

function EmailListTopbarActions({ state }) {
    if (state == 'none') {
        // TODO
        return <div></div>
    } else {
        return (
            <div className="email-list-topbar-actions">
                <SmallActionButton type="delete" />
                <SmallActionButton type="unread" />
            </div>
        )
    }
}
