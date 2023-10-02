import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'
import EmailLabelApplyMenu from './email-label/EmailLabelApplyMenu'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorChange,
    onDeleteClick,
    onUpdateSelectedEmails,
    readButtonToShow,
    starredButtonToShow,
    selectedEmails,
    labels,
    updateEmails,
    isLabelMenuVisible,
    toggleShowLabelMenu,
}) {
    async function onReadOrUnreadClick() {
        onUpdateSelectedEmails('isRead', readButtonToShow)
    }

    async function onStarredOrUnstarredClick() {
        onUpdateSelectedEmails('isStarred', starredButtonToShow)
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
                    {/* Mark as starred/unstarred */}
                    <SmallActionButton
                        type={starredButtonToShow ? 'starred' : 'unstarred'}
                        onClick={onStarredOrUnstarredClick}
                    />
                    {/* Apply Labels */}
                    <EmailLabelApplyMenu
                        show={isLabelMenuVisible}
                        emails={selectedEmails}
                        labels={labels}
                        updateEmails={updateEmails}
                        toggleShowLabelMenu={toggleShowLabelMenu}
                    />
                </div>
            )}
        </div>
    )
}
