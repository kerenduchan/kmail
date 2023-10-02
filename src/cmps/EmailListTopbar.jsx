import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorChange,
    onDeleteClick,
    onUpdateSelectedEmails,
    readButtonToShow,
}) {
    async function onReadOrUnreadClick() {
        onUpdateSelectedEmails({ isRead: readButtonToShow })
    }

    function onCheckboxClick() {
        switch (multiSelectorState) {
            case 'all':
            case 'some':
                onMultiSelectorChange('none')
                break
            case 'none':
                onMultiSelectorChange('all')
                break
        }
    }

    return (
        <div className="email-list-topbar">
            {/* Checkbox */}
            <MultiSelector
                state={multiSelectorState}
                onClick={onCheckboxClick}
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
