import { useEffect, useState } from 'react'
import { MultiSelector } from './MultiSelector'
import { SmallActionButton } from './SmallActionButton'
import EmailLabelApplyMenu from './email-label/EmailLabelApplyMenu'

export function EmailListTopbar({
    emails,
    selectedEmailIds,
    onMultiSelectorChange,
    onDeleteClick,
    onUpdateSelectedEmails,
    labels,
    updateEmails,
    isLabelMenuVisible,
    toggleShowLabelMenu,
}) {
    // Whether all the selected emals are read. Affects the read/unread button
    const [areAllRead, setAreAllRead] = useState(false)

    // Whether all the selected emals are starred.
    // Affects the star/unstar button
    const [areAllStarred, setAreAllStarred] = useState(false)

    // the state of the email multi-selector in the top bar (none, some, all)
    const [multiSelectorState, setMultiSelectorState] = useState('none')

    // Changing the selected emails affects the multi-selector state and
    // other top bar buttons (mark read, star/unstar)
    useEffect(() => {
        if (selectedEmailIds.length === 0) {
            setMultiSelectorState('none')
        } else if (selectedEmailIds.length === emails.length) {
            setMultiSelectorState('all')
        } else {
            setMultiSelectorState('some')
        }

        // Update areAllRead and areAllStarred
        const selectedEmails = getSelectedEmails()
        setAreAllRead(selectedEmails.every((e) => e.isRead === true))
        setAreAllStarred(selectedEmails.every((e) => e.isStarred === true))
    }, [selectedEmailIds, emails])

    // Notify the EmailIndex of multi-select state change (affects the selected)
    // emails
    useEffect(() => {
        onMultiSelectorChange()
    }, [multiSelectorState])

    // Handle a click on the read/unread button
    async function onReadOrUnreadClick() {
        onUpdateSelectedEmails('isRead', !areAllRead)
    }

    // Handle a click on the star/unstar button
    async function onStarOrUnstarClick() {
        onUpdateSelectedEmails('isStarred', !areAllStarred)
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

    function getSelectedEmails() {
        return emails.filter((e) => selectedEmailIds.includes(e.id))
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
                        type={areAllRead ? 'unread' : 'read'}
                        onClick={onReadOrUnreadClick}
                    />

                    {/* Mark as starred/unstarred */}
                    <SmallActionButton
                        type={areAllStarred ? 'unstarred' : 'starred'}
                        onClick={onStarOrUnstarClick}
                    />

                    {/* Apply Labels */}
                    <EmailLabelApplyMenu
                        show={isLabelMenuVisible}
                        emails={getSelectedEmails()}
                        labels={labels}
                        updateEmails={updateEmails}
                        toggleShowLabelMenu={toggleShowLabelMenu}
                    />
                </div>
            )}
        </div>
    )
}
