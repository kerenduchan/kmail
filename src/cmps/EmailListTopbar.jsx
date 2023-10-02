import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorFilterChange,
    onDeleteClick,
    onUpdateSelectedEmails,
    readButtonToShow,
}) {
    async function onReadOrUnreadClick() {
        onUpdateSelectedEmails({ isRead: readButtonToShow })
    }

    return (
        <div className="email-list-topbar">
            {/* Checkbox */}
            <MultiSelector
                state={multiSelectorState}
                onFilterChange={onMultiSelectorFilterChange}
            />
            {/* Actions */}
            {multiSelectorState == 'none' ? (
                <div></div>
            ) : (
                <div className="email-list-topbar-actions">
                    {/* Delete */}
                    <SmallActionButton type="delete" onClick={onDeleteClick} />
                    {/* Mark as uread/unread */}
                    <SmallActionButton
                        type={readButtonToShow ? 'read' : 'unread'}
                        onClick={onReadOrUnreadClick}
                    />
                </div>
            )}
        </div>
    )
}
