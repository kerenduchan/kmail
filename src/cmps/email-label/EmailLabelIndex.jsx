import { SmallActionButton } from '../SmallActionButton'
import { EmailLabelList } from './EmailLabelList'

export function EmailLabelIndex({ labels, onCreateClick, onDeleteLabel }) {
    return (
        <div className="email-label-index">
            <div className="email-label-index-title">Labels</div>
            <div className="email-label-index-actions">
                <SmallActionButton type="create" onClick={onCreateClick} />
            </div>
            <EmailLabelList labels={labels} onDeleteLabel={onDeleteLabel} />
        </div>
    )
}
