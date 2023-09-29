import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'

export function EmailListTopbar({
    multiSelectorState,
    onMultiSelectorFilterChange,
    onDeleteClick,
    onUpdateSelectedEmails,
    readButtonToShow,
}) {
    return (
        <div className="email-list-topbar">
            {/* Checkbox */}
            <MultiSelector
                state={multiSelectorState}
                onFilterChange={onMultiSelectorFilterChange}
            />
            {/* Actions */}
            <EmailListTopbarActions
                state={multiSelectorState}
                onDeleteClick={onDeleteClick}
                onUpdateSelectedEmails={onUpdateSelectedEmails}
                readButtonToShow={readButtonToShow}
            />
        </div>
    )
}

function EmailListTopbarActions({
    state,
    onDeleteClick,
    onUpdateSelectedEmails,
    readButtonToShow,
}) {
    async function onReadOrUnreadClick() {
        onUpdateSelectedEmails({ isRead: readButtonToShow })
    }

    if (state == 'none') {
        // TODO
        return <div></div>
    } else {
        return (
            <div className="email-list-topbar-actions">
                <SmallActionButton type="delete" onClick={onDeleteClick} />
                <SmallActionButton
                    type={readButtonToShow ? 'read' : 'unread'}
                    onClick={onReadOrUnreadClick}
                />
            </div>
        )
    }
}
