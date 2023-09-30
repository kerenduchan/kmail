import { SmallActionButton } from './SmallActionButton'

export function EmailLabelCreate({ onCloseClick }) {
    return (
        <div className="email-label-create-dialog">
            <div className="email-label-create">
                <div className="email-label-create-title">New Label</div>
                <SmallActionButton
                    type="close"
                    className="email-label-create-close-btn"
                    onClick={onCloseClick}
                ></SmallActionButton>
            </div>
        </div>
    )
}
