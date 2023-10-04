export { buildMsgsForUpdateLabelsForEmails }

function buildMsgsForUpdateLabelsForEmails(folderId, emails, labelInfos) {
    const subject = _getItemDescription(folderId, emails)
    const labelName = labelInfos[0].label.name

    // success message
    const action = labelInfos[0].isAdd ? 'added to' : 'removed from'
    const success = `${subject} ${action} '${labelName}'.`

    // error message
    const failedAction = labelInfos[0].isAdd
        ? `add ${subject} to`
        : `remove ${subject} from`
    const error = `Failed to ${failedAction} '${labelName}'.`

    return { success, error }
}

function _getItemDescription(folderId, emails) {
    const suffix = emails.length > 1 ? 's' : ''
    const noun = folderId == 'drafts' ? 'draft' : 'email'
    if (emails.length == 1) {
        return _uppercaseFirstLetter(`${noun}${suffix}`)
    }
    return `${emails.length} ${noun}${suffix}`
}

function _uppercaseFirstLetter(msg) {
    return msg[0].toUpperCase() + msg.slice(1)
}
