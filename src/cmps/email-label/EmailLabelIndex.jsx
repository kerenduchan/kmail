import { SmallActionButton } from '../SmallActionButton'
import { EmailLabelList } from './EmailLabelList'

export function EmailLabelIndex({ labels, onCreateClick }) {
    return (
        <div className="email-labels">
            <div className="email-labels-title">Labels</div>
            <SmallActionButton
                type="create"
                className="email-labels-create-btn-container"
                onClick={onCreateClick}
            />
            <EmailLabelList labels={labels} />
        </div>
    )
}
