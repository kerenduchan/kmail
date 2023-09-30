import { SmallActionButton } from './SmallActionButton'

export function Dialog({ title, onCloseClick, children }) {
    return (
        <div className="dialog-bg">
            <div className="dialog">
                <div className="dialog-header">
                    <div className="dialog-header-title">{title}</div>
                    <SmallActionButton
                        type="close"
                        className="dialog-header-close-btn"
                        onClick={onCloseClick}
                    ></SmallActionButton>
                </div>
                <div className="dialog-body">{children}</div>
            </div>
        </div>
    )
}
