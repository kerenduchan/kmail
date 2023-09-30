export function SmallActionButton({ type, img, onClick, className }) {
    const types = {
        hamburger: 'imgs/hamburger-menu.svg',
        edit: 'imgs/edit.svg',
    }

    return (
        <div
            className={
                'small-action-btn-container' +
                (className ? ` ${className}` : '')
            }
        >
            <button
                type="button"
                className={'small-action-btn small-action-btn-' + type}
                onClick={onClick}
            >
                <img src={img ? img : types[type]} />
            </button>
        </div>
    )
}
