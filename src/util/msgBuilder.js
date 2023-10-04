export {
    buildMsgsForUpdateLabelsForEmails,
    buildMsgsForDeleteEmailsForever,
    buildMsgsForMoveEmailsToBin,
}

function buildMsgsForUpdateLabelsForEmails(folderId, emails, labelInfos) {
    const subject = _getItemDescription(folderId, emails)
    const labelName = labelInfos[0].label.name

    // success message
    const action = labelInfos[0].isAdd ? 'added to' : 'removed from'
    const success = _uppercaseFirstLetter(
        `${subject} ${action} '${labelName}'.`
    )

    // error message
    const failedAction = labelInfos[0].isAdd
        ? `add ${subject} to`
        : `remove ${subject} from`
    const error = `Failed to ${failedAction} '${labelName}'.`

    return { success, error }
}

function buildMsgsForDeleteEmailsForever(folderId, emailIds) {
    const subject = _getItemDescription(folderId, emailIds)
    const success = `${subject} deleted forever.`
    const error = `Failed to delete ${subject} forever.`
    return { success, error }
}

function buildMsgsForMoveEmailsToBin(folderId, emailIds) {
    const subject = _getItemDescription(folderId, emailIds)

    // success message
    const action = folderId == 'drafts' ? 'discarded' : 'moved to Bin'
    const success = _uppercaseFirstLetter(`${subject} ${action}.`)

    // error message
    const failedAction =
        folderId == 'drafts' ? `discard ${subject}` : `move ${subject} to Bin`
    const error = `Failed to ${failedAction}.`
    return { success, error }
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
