import { SmallActionButton } from './SmallActionButton'

export function EmailLabelCreate({ onCloseClick }) {
    return (
        <div className="email-label-create-dialog">
            <div className="email-label-create">
                <div className="email-label-create-title">New Label</div>
                <div className="email-label-create-close-btn">
                    <SmallActionButton
                        type="close"
                        onClick={onCloseClick}
                    ></SmallActionButton>
                </div>
            </div>
        </div>
    )
}
