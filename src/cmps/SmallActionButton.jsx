export function SmallActionButton({ type, img, onClick }) {
    const types = {
        delete: 'imgs/garbage-bin.svg',
        back: 'imgs/left-arrow.svg',
        read: 'imgs/mail-read.svg',
        unread: 'imgs/mail-unread.svg',
        starred: 'imgs/starred.svg',
        unstarred: 'imgs/unstarred.svg',
    }

    return (
        <button className="small-action-btn" onClick={onClick}>
            <img src={img ? img : types[type]} />
        </button>
    )
}
