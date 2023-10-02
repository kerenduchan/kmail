export function SmallActionButton({ type, img, onClick, className }) {
    const types = {
        hamburger: 'imgs/hamburger-menu.svg',
        edit: 'imgs/edit.svg',
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
            <img className={'icon-' + type} src={img ? img : types[type]} />
        </button>
    )
}
