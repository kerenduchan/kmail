import { SmallActionButton } from '../SmallActionButton'
import { EmailLabelList } from './EmailLabelList'

export function EmailLabelIndex({
    labels,
    onLabelClick,
    onCreateLabelClick,
    onDeleteLabelClick,
    onEditLabelClick,
}) {
    return (
        <div className="email-label-index">
            <div className="email-label-index-title">Labels</div>
            <div className="email-label-index-actions">
                <SmallActionButton
                    type="create"
                    onClick={onCreateLabelClick}
                    title="Create new label"
                />
            </div>
            <EmailLabelList
                labels={labels}
                onLabelClick={onLabelClick}
                onDeleteLabelClick={onDeleteLabelClick}
                onEditLabelClick={onEditLabelClick}
            />
        </div>
    )
}
