export function SmallActionButton({ type, img, onClick, className }) {
    const types = {
        hamburger: 'imgs/hamburger-menu.svg',
    }

    return (
        <button
            type="button"
            className={
                'small-action-btn small-action-btn-' +
                type +
                (className ? ` ${className}` : '')
            }
            onClick={onClick}
        >
            <img src={img ? img : types[type]} />
        </button>
    )
}
