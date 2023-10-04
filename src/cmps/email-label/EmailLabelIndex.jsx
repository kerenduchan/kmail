import { SmallActionButton } from '../SmallActionButton'
import { EmailLabelList } from './EmailLabelList'

export function EmailLabelIndex({
    labels,
    activeFolderId,
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
                activeFolderId={activeFolderId}
                onLabelClick={onLabelClick}
                onDeleteLabelClick={onDeleteLabelClick}
                onEditLabelClick={onEditLabelClick}
            />
        </div>
    )
}
