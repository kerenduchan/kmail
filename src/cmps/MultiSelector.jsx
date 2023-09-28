export function MultiSelector({ state, filters, onFilterChange }) {
    // state should be one of: none, all, some

    function onCheckboxClick() {
        switch (state) {
            case 'all':
            case 'some':
                onFilterChange('none')
                break
            case 'none':
                onFilterChange('all')
                break
        }
    }

    return (
        <div className="multi-selector">
            <div
                className={`multi-selector-checkbox ${state || 'none'}`}
                onClick={onCheckboxClick}
            />
            <div className="multi-selector-dropdown-arrow" />
        </div>
    )
}
