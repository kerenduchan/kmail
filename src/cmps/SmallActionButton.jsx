export function SmallActionButton({ type, img, onClick, className }) {
    const types = {
        delete: 'imgs/garbage-bin.svg',
        back: 'imgs/left-arrow.svg',
        read: 'imgs/mail-read.svg',
        unread: 'imgs/mail-unread.svg',
        starred: 'imgs/starred.svg',
        unstarred: 'imgs/unstarred.svg',
        hamburger: 'imgs/hamburger-menu.svg',
    }

    return (
        <button
            className={'small-action-btn' + (className ? ` ${className}` : '')}
            onClick={onClick}
        >
            <img src={img ? img : types[type]} />
        </button>
    )
}
