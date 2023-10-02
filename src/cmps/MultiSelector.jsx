export function MultiSelector({ state, onClick }) {
    // state should be one of: none, all, some
    return (
        <div className="multi-selector">
            <div
                className={`multi-selector-checkbox ${state || 'none'}`}
                onClick={onClick}
            >
                <img />
            </div>
        </div>
    )
}
