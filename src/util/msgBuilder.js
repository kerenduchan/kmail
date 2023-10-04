export {
    buildMsgsForUpdateLabelsForEmails,
    buildMsgsForDeleteEmailsForever,
    buildMsgsForMoveEmailsToBin,
    buildMsgsForSaveLabel,
    buildMsgsForDeleteLabel,
    buildMsgsForUpdateEmails,
}

function buildMsgsForUpdateLabelsForEmails(folderId, emails, labelInfos) {
    const subject = _getItemDescription(folderId, emails)
    const labelName = labelInfos[0].label.name

    // success message
    const action = labelInfos[0].isAdd ? 'added to' : 'removed from'
    const success = _uppercaseFirstLetter(`${subject} ${action} '${labelName}'`)

    // error message
    const failedAction = labelInfos[0].isAdd
        ? `add ${subject} to`
        : `remove ${subject} from`
    const error = `Failed to ${failedAction} '${labelName}'`

    return _addPunctuation({ success, error })
}

function buildMsgsForDeleteEmailsForever(folderId, emailIds) {
    const subject = _getItemDescription(folderId, emailIds)
    const success = _uppercaseFirstLetter(`${subject} deleted forever`)
    const error = `Failed to delete ${subject} forever`
    return _addPunctuation({ success, error })
}

function buildMsgsForMoveEmailsToBin(folderId, emailIds) {
    const subject = _getItemDescription(folderId, emailIds)

    // success message
    const action = folderId == 'drafts' ? 'discarded' : 'moved to Bin'
    const success = _uppercaseFirstLetter(`${subject} ${action}`)

    // error message
    const failedAction =
        folderId == 'drafts' ? `discard ${subject}` : `move ${subject} to Bin`
    const error = `Failed to ${failedAction}`
    return _addPunctuation({ success, error })
}

function buildMsgsForSaveLabel(label) {
    return _buildMsgsForSaveOrDeleteLabel(label, false)
}

function buildMsgsForDeleteLabel(label) {
    return _buildMsgsForSaveOrDeleteLabel(label, true)
}

function buildMsgsForUpdateEmails(folderId, emails, field, value) {
    let subject = _getItemDescription(folderId, emails)

    let progress, successAction, failedAction
    if (field == 'isRead') {
        const type = value ? 'read' : 'unread'
        progress = `Marking ${subject} as ${type}`
        successAction = `marked as ${type}`
        failedAction = `mark ${subject} as ${type}`
    } else if (field == 'isStarred') {
        progress = `${value ? 'Starring' : 'Unstarring'} ${subject}`
        successAction = value ? 'starred' : 'unstarred'
        failedAction = `${value ? 'star' : 'unstar'} ${subject}`
    }

    const success = _uppercaseFirstLetter(`${subject} ${successAction}`)
    const error = `Failed to ${failedAction}`
    return _addPunctuation({ progress, success, error })
}

function _buildMsgsForSaveOrDeleteLabel(label, isDelete) {
    const subject = 'label' + (label.name.length ? ` '${label.name}'` : '')

    // success message
    const action = isDelete ? 'deleted' : label.id ? 'updated' : 'created'
    const success = _uppercaseFirstLetter(`${subject} ${action}`)

    // error message
    const failedAction = isDelete ? 'delete' : label.id ? 'update' : 'create'
    const error = `Failed to ${failedAction} ${subject}`

    return _addPunctuation({ success, error })
}

// helper functions

function _getItemDescription(folderId, emails) {
    const suffix = emails.length > 1 ? 's' : ''
    const noun = folderId == 'drafts' ? 'draft' : 'email'
    if (emails.length == 1) {
        return `${noun}${suffix}`
    }
    return `${emails.length} ${noun}${suffix}`
}

function _uppercaseFirstLetter(msg) {
    return msg[0].toUpperCase() + msg.slice(1)
}

function _addPunctuation(obj) {
    if (obj.progress) {
        obj.progress += '...'
    }
    obj.success += '.'
    obj.error += '.'
    return obj
}
