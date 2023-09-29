import { MultiSelector } from './MultiSelector'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorFilterChange,
}) {
    return (
        <div className="email-list-topbar">
            <MultiSelector
                state={multiSelectorState}
                onFilterChange={onMultiSelectorFilterChange}
            />
        </div>
    )
}
