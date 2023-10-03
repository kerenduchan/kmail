import { getAllFolderIds } from '../util.js'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { labelService } from './label.service.js'

export const emailService = {
    query,
    save,
    updateMany,
    sendEmail,
    remove,
    deleteEmailsByIds,
    getById,
    createEmail,
    getDefaultFilter,
    getLoggedInUser,
    generateEmails,
    getEmailCountsPerFolder,
    updateLabelsForEmails,
    removeLabelFromAllEmails,
}

const loggedinUser = {
    email: 'keren.duchan@gmail.com',
    fullname: 'Keren Duchan',
}

const STORAGE_KEY = 'emails'

function getLoggedInUser() {
    return loggedinUser
}

function _doesEmailMatchFilter(email, filter) {
    // isRead
    if (filter.isRead !== null && email.isRead !== filter.isRead) {
        return false
    }
    // isStarred
    if (filter.isStarred !== null && email.isStarred !== filter.isStarred) {
        return false
    }
    // searchString
    if (filter.searchString) {
        const lowercaseSearchString = filter.searchString.toLowerCase()
        if (
            !email.subject.toLowerCase().includes(lowercaseSearchString) &&
            !email.body.toLowerCase().includes(lowercaseSearchString)
        ) {
            return false
        }
    }

    return doesEmailBelongInFolder(email, filter.folder)
}

async function query(filter) {
    let emails = await storageService.query(STORAGE_KEY)
    if (filter) {
        emails = emails.filter((email) => _doesEmailMatchFilter(email, filter))
        if (filter.folder != 'drafts') {
            emails = emails.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1))
        }
    }

    await _expandLabelsOnEmails(emails)
    return emails
}

function doesEmailBelongInFolder(email, folder) {
    if (folder != 'bin' && email.deletedAt !== null) {
        return false
    }

    switch (folder) {
        case 'inbox':
            return (
                email.sentAt !== null &&
                email.to == emailService.getLoggedInUser().email
            )
        case 'sent':
            return (
                email.sentAt !== null &&
                email.from == emailService.getLoggedInUser().email
            )
        case 'drafts':
            return email.sentAt == null
        case 'starred':
            return email.isStarred
        case 'all':
            return email.sentAt != null
        case 'bin':
            return email.deletedAt !== null
    }
    return true
}

// This should be server-side logic, since the frontend should not
// load all emails (pagination, filtering, etc)
async function getEmailCountsPerFolder() {
    let emails = await storageService.query(STORAGE_KEY)
    const folders = getAllFolderIds()
    const counts = folders.map((folder) => {
        let total = 0,
            unread = 0
        emails.forEach((email) => {
            if (doesEmailBelongInFolder(email, folder)) {
                total++
                if (email.isRead === false) {
                    unread++
                }
            }
        })
        return { total, unread }
    })

    return Object.fromEntries(folders.map((folder, i) => [folder, counts[i]]))
}

async function getById(id) {
    const email = await storageService.get(STORAGE_KEY, id)
    await _expandLabelsOnEmails([email])
    return email
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function deleteEmailsByIds(ids) {
    return storageService.removeMany(STORAGE_KEY, ids)
}

function sendEmail(email) {
    return save({ ...email, sentAt: Date.now() })
}

function save(email) {
    // remove expanded labels field
    const emailToSave = { ...email }
    delete emailToSave.labels

    if (email.id) {
        return storageService.put(STORAGE_KEY, email)
    } else {
        return storageService.post(STORAGE_KEY, email)
    }
}

async function updateMany(emails) {
    return storageService.putMany(STORAGE_KEY, emails)
}

// add/remove the given label IDs to/from the given emails
// label IDs is a map object: key is labelId, value is true (add label)
// or false (remove label)
async function updateLabelsForEmails(emails, labelIds) {
    let emailsToUpdate = null
    Object.keys(labelIds).forEach((labelId) => {
        if (labelIds[labelId] === false) {
            // remove the label from all emails
            emailsToUpdate = emails.map((e) => ({
                ...e,
                labelIds: e.labelIds.filter((lId) => lId != labelId),
            }))
        } else {
            // add the label to any emails that don't already have it
            emailsToUpdate = emails
                .filter((e) => !e.labelIds.includes(labelId))
                .map((e) => ({ ...e, labelIds: e.labelIds.concat(labelId) }))
        }
    })
    return emailService.updateMany(emailsToUpdate)
}

// Remove the given label ID from all emails. Needs to be done as part of
// deleting a label.
async function removeLabelFromAllEmails(labelId) {
    const allEmails = await emailService.query()
    allEmails.forEach(
        (e) => (e.labelIds = e.labelIds.filter((lId) => lId !== labelId))
    )
    return updateMany(allEmails)
}

function createEmail() {
    return {
        id: null,
        subject: '',
        body: '',
        to: '',
        from: loggedinUser.email,
        isRead: false,
        isStarred: false,
        sentAt: null,
        deletedAt: null,
    }
}

function getDefaultFilter() {
    return {
        isRead: null,
        isStarred: null,
        searchString: '',
        folder: null,
    }
}

async function generateEmails() {
    const emails = [
        {
            id: utilService.makeId(),
            subject: 'Hello',
            body: 'Write me back please. Thanks.',
            isRead: false,
            isStarred: false,
            deletedAt: null,
            sentAt: 1694113055000,
            from: 'moshe@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: "What's up?",
            body: `Hey man, 
            How are you? 
            Send money soon.
            
            Thanks,
            Bob`,
            isRead: false,
            isStarred: false,
            deletedAt: null,
            sentAt: 1694112055000,
            from: 'bob@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'למה לא כתבת לי',
            body: 'ביקשתי שתחזור אליי... בבקשה תתקשר',
            isRead: true,
            isStarred: false,
            deletedAt: null,
            sentAt: 1694132055000,
            from: 'moshe@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'This is in the bin',
            body: 'This email has been put in the bin',
            isRead: true,
            isStarred: false,
            deletedAt: 1695112077000,
            sentAt: 1694112055000,
            from: 'moshe@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'Hi again',
            body: 'Would you like to talk?',
            isRead: true,
            isStarred: true,
            deletedAt: null,
            sentAt: 1693920361000,
            from: 'shoshana@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'Nope',
            body: "I'm busy, can't talk, sorry.",
            isRead: true,
            isStarred: true,
            deletedAt: null,
            sentAt: 1693930361000,
            from: 'keren.duchan@gmail.com',
            to: 'shoshana@gmail.com',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject:
                'This is a very long subject that should probably be shorter but for some reason it is just so long',
            body: 'This is the body of the email with the very long subject',
            isRead: true,
            isStarred: false,
            sentAt: 1693920361000,
            from: 'shoshana@gmail.com',
            to: 'keren.duchan@gmail.com',
            deletedAt: null,
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'Lorem ipsum',
            body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            
Nullam porta cursus tempus. Quisque dui risus, egestas et felis in, euismod rutrum nibh. Maecenas aliquam accumsan blandit. Fusce eget erat eu lacus volutpat hendrerit. Aenean sodales, magna in posuere aliquam, libero dolor eleifend dui, vitae feugiat arcu arcu at nunc. Etiam volutpat vel odio sit amet sodales. Nulla et nisi efficitur, pretium erat at, tempus tortor. Aliquam felis nulla, porta nec tempor sed, fringilla eu urna. Pellentesque non convallis nulla.'
Nulla sodales, dui vitae interdum interdum, enim enim aliquam urna, at accumsan risus quam id nunc. In tellus lacus, aliquam quis quam vitae, congue cursus sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis lorem. In id dui massa. Vestibulum tincidunt sit amet orci non dapibus. Sed in vehicula dolor. Sed volutpat odio quis accumsan vulputate. Morbi dapibus lorem sem, ut dictum odio suscipit sit amet. Sed aliquet vel libero vitae lobortis. Duis at suscipit metus. Aenean vestibulum lobortis urna. Aenean pulvinar varius scelerisque. Nulla tincidunt orci arcu, sit amet efficitur tortor dapibus a. Sed eget nisi eleifend justo tincidunt scelerisque eget id velit. Pellentesque fermentum, neque sit amet egestas convallis, eros lacus feugiat velit, eget elementum lectus erat vel diam.
Suspendisse interdum nisi vel commodo bibendum. Cras mi ligula, mollis nec pretium ut, imperdiet quis nibh. Sed porttitor aliquam tortor, a rutrum tortor tristique non. Duis sed iaculis est. Aliquam sit amet iaculis tortor, nec volutpat nulla. Donec libero erat, sodales id commodo at, euismod ut mi. Proin tempor, metus ut dictum bibendum, nunc neque maximus tortor, eget pulvinar sapien dolor quis est. Donec nisl odio, lobortis sit amet magna ut, condimentum porta ex. Duis quis elementum sapien, ut ornare leo. Proin dui justo, feugiat vitae dapibus consequat, cursus nec nulla. Etiam posuere risus et velit pharetra imperdiet. Maecenas varius, eros vitae eleifend maximus, sapien turpis varius urna, in iaculis est mauris sagittis nibh. Fusce et urna justo. Quisque in nibh eget magna vestibulum lacinia. Phasellus efficitur bibendum ante, eget laoreet dolor porta ut. Vestibulum aliquam nulla lectus, in volutpat massa aliquet eu.
Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc dictum sapien eget dui congue, et auctor lectus lacinia. Vivamus ac posuere urna, vitae pellentesque tortor. Curabitur condimentum, justo vel pellentesque tempus, dui quam rhoncus arcu, et ultrices ante est eu justo. Donec consectetur ac sem id feugiat. Vestibulum sodales vitae risus sit amet pulvinar. Nam sed justo in purus eleifend sodales. In blandit vel odio in vestibulum. Morbi viverra eros sit amet nulla aliquet aliquet. Vestibulum semper sed libero non dictum.

Etiam auctor vitae nulla eu consequat. Maecenas sed tortor porttitor, viverra urna eget, pharetra tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nec velit suscipit, vehicula ex in, accumsan ligula. Vestibulum vehicula imperdiet tortor, sit amet dictum ipsum congue in. Duis cursus nunc non vulputate gravida. Etiam faucibus finibus iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse vel sapien iaculis dolor mattis iaculis. Nam felis nibh, facilisis at placerat vitae, lacinia sed arcu.`,
            isRead: true,
            isStarred: false,
            deletedAt: null,
            sentAt: null,
            from: 'keren.duchan@gmail.com',
            to: '',
            labelIds: [],
        },
        {
            id: utilService.makeId(),
            subject: 'Lorem ipsum 2',
            body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta cursus tempus. Quisque dui risus, egestas et felis in, euismod rutrum nibh. Maecenas aliquam accumsan blandit. Fusce eget erat eu lacus volutpat hendrerit. Aenean sodales, magna in posuere aliquam, libero dolor eleifend dui, vitae feugiat arcu arcu at nunc. Etiam volutpat vel odio sit amet sodales. Nulla et nisi efficitur, pretium erat at, tempus tortor. Aliquam felis nulla, porta nec tempor sed, fringilla eu urna. Pellentesque non convallis nulla.'
            Nulla sodales, dui vitae interdum interdum, enim enim aliquam urna, at accumsan risus quam id nunc. In tellus lacus, aliquam quis quam vitae, congue cursus sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis lorem. In id dui massa. Vestibulum tincidunt sit amet orci non dapibus. Sed in vehicula dolor. Sed volutpat odio quis accumsan vulputate. Morbi dapibus lorem sem, ut dictum odio suscipit sit amet. Sed aliquet vel libero vitae lobortis. Duis at suscipit metus. Aenean vestibulum lobortis urna. Aenean pulvinar varius scelerisque. Nulla tincidunt orci arcu, sit amet efficitur tortor dapibus a. Sed eget nisi eleifend justo tincidunt scelerisque eget id velit. Pellentesque fermentum, neque sit amet egestas convallis, eros lacus feugiat velit, eget elementum lectus erat vel diam.
            Suspendisse interdum nisi vel commodo bibendum. Cras mi ligula, mollis nec pretium ut, imperdiet quis nibh. Sed porttitor aliquam tortor, a rutrum tortor tristique non. Duis sed iaculis est. Aliquam sit amet iaculis tortor, nec volutpat nulla. Donec libero erat, sodales id commodo at, euismod ut mi. Proin tempor, metus ut dictum bibendum, nunc neque maximus tortor, eget pulvinar sapien dolor quis est. Donec nisl odio, lobortis sit amet magna ut, condimentum porta ex. Duis quis elementum sapien, ut ornare leo. Proin dui justo, feugiat vitae dapibus consequat, cursus nec nulla. Etiam posuere risus et velit pharetra imperdiet. Maecenas varius, eros vitae eleifend maximus, sapien turpis varius urna, in iaculis est mauris sagittis nibh. Fusce et urna justo. Quisque in nibh eget magna vestibulum lacinia. Phasellus efficitur bibendum ante, eget laoreet dolor porta ut. Vestibulum aliquam nulla lectus, in volutpat massa aliquet eu.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc dictum sapien eget dui congue, et auctor lectus lacinia. Vivamus ac posuere urna, vitae pellentesque tortor. Curabitur condimentum, justo vel pellentesque tempus, dui quam rhoncus arcu, et ultrices ante est eu justo. Donec consectetur ac sem id feugiat. Vestibulum sodales vitae risus sit amet pulvinar. Nam sed justo in purus eleifend sodales. In blandit vel odio in vestibulum. Morbi viverra eros sit amet nulla aliquet aliquet. Vestibulum semper sed libero non dictum.
            Etiam auctor vitae nulla eu consequat. 
            
            Maecenas sed tortor porttitor, viverra urna eget, pharetra tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nec velit suscipit, vehicula ex in, accumsan ligula. Vestibulum vehicula imperdiet tortor, sit amet dictum ipsum congue in. Duis cursus nunc non vulputate gravida. Etiam faucibus finibus iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse vel sapien iaculis dolor mattis iaculis. Nam felis nibh, facilisis at placerat vitae, lacinia sed arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta cursus tempus. Quisque dui risus, egestas et felis in, euismod rutrum nibh. Maecenas aliquam accumsan blandit. Fusce eget erat eu lacus volutpat hendrerit. Aenean sodales, magna in posuere aliquam, libero dolor eleifend dui, vitae feugiat arcu arcu at nunc. Etiam volutpat vel odio sit amet sodales. Nulla et nisi efficitur, pretium erat at, tempus tortor. Aliquam felis nulla, porta nec tempor sed, fringilla eu urna. Pellentesque non convallis nulla.'
            Nulla sodales, dui vitae interdum interdum, enim enim aliquam urna, at accumsan risus quam id nunc. In tellus lacus, aliquam quis quam vitae, congue cursus sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis lorem. In id dui massa. Vestibulum tincidunt sit amet orci non dapibus. Sed in vehicula dolor. Sed volutpat odio quis accumsan vulputate. Morbi dapibus lorem sem, ut dictum odio suscipit sit amet. Sed aliquet vel libero vitae lobortis. Duis at suscipit metus. Aenean vestibulum lobortis urna. Aenean pulvinar varius scelerisque. Nulla tincidunt orci arcu, sit amet efficitur tortor dapibus a. Sed eget nisi eleifend justo tincidunt scelerisque eget id velit. Pellentesque fermentum, neque sit amet egestas convallis, eros lacus feugiat velit, eget elementum lectus erat vel diam.
            Suspendisse interdum nisi vel commodo bibendum. Cras mi ligula, mollis nec pretium ut, imperdiet quis nibh. Sed porttitor aliquam tortor, a rutrum tortor tristique non. Duis sed iaculis est. Aliquam sit amet iaculis tortor, nec volutpat nulla. Donec libero erat, sodales id commodo at, euismod ut mi. Proin tempor, metus ut dictum bibendum, nunc neque maximus tortor, eget pulvinar sapien dolor quis est. Donec nisl odio, lobortis sit amet magna ut, condimentum porta ex. Duis quis elementum sapien, ut ornare leo. Proin dui justo, feugiat vitae dapibus consequat, cursus nec nulla. Etiam posuere risus et velit pharetra imperdiet. Maecenas varius, eros vitae eleifend maximus, sapien turpis varius urna, in iaculis est mauris sagittis nibh. Fusce et urna justo. Quisque in nibh eget magna vestibulum lacinia. Phasellus efficitur bibendum ante, eget laoreet dolor porta ut. Vestibulum aliquam nulla lectus, in volutpat massa aliquet eu.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc dictum sapien eget dui congue, et auctor lectus lacinia. Vivamus ac posuere urna, vitae pellentesque tortor. Curabitur condimentum, justo vel pellentesque tempus, dui quam rhoncus arcu, et ultrices ante est eu justo. Donec consectetur ac sem id feugiat. Vestibulum sodales vitae risus sit amet pulvinar. Nam sed justo in purus eleifend sodales. In blandit vel odio in vestibulum. Morbi viverra eros sit amet nulla aliquet aliquet. Vestibulum semper sed libero non dictum.

            Etiam auctor vitae nulla eu consequat. Maecenas sed tortor porttitor, viverra urna eget, pharetra tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nec velit suscipit, vehicula ex in, accumsan ligula. Vestibulum vehicula imperdiet tortor, sit amet dictum ipsum congue in. Duis cursus nunc non vulputate gravida. Etiam faucibus finibus iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse vel sapien iaculis dolor mattis iaculis. Nam felis nibh, facilisis at placerat vitae, lacinia sed arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta cursus tempus. Quisque dui risus, egestas et felis in, euismod rutrum nibh. Maecenas aliquam accumsan blandit. Fusce eget erat eu lacus volutpat hendrerit. Aenean sodales, magna in posuere aliquam, libero dolor eleifend dui, vitae feugiat arcu arcu at nunc. Etiam volutpat vel odio sit amet sodales. Nulla et nisi efficitur, pretium erat at, tempus tortor. Aliquam felis nulla, porta nec tempor sed, fringilla eu urna. Pellentesque non convallis nulla.'
            Nulla sodales, dui vitae interdum interdum, enim enim aliquam urna, at accumsan risus quam id nunc. In tellus lacus, aliquam quis quam vitae, congue cursus sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis lorem. In id dui massa. Vestibulum tincidunt sit amet orci non dapibus. Sed in vehicula dolor. Sed volutpat odio quis accumsan vulputate. Morbi dapibus lorem sem, ut dictum odio suscipit sit amet. Sed aliquet vel libero vitae lobortis. Duis at suscipit metus. Aenean vestibulum lobortis urna. Aenean pulvinar varius scelerisque. Nulla tincidunt orci arcu, sit amet efficitur tortor dapibus a. Sed eget nisi eleifend justo tincidunt scelerisque eget id velit. Pellentesque fermentum, neque sit amet egestas convallis, eros lacus feugiat velit, eget elementum lectus erat vel diam.
            Suspendisse interdum nisi vel commodo bibendum. Cras mi ligula, mollis nec pretium ut, imperdiet quis nibh. Sed porttitor aliquam tortor, a rutrum tortor tristique non. Duis sed iaculis est. Aliquam sit amet iaculis tortor, nec volutpat nulla. Donec libero erat, sodales id commodo at, euismod ut mi. Proin tempor, metus ut dictum bibendum, nunc neque maximus tortor, eget pulvinar sapien dolor quis est. Donec nisl odio, lobortis sit amet magna ut, condimentum porta ex. Duis quis elementum sapien, ut ornare leo. Proin dui justo, feugiat vitae dapibus consequat, cursus nec nulla. Etiam posuere risus et velit pharetra imperdiet. Maecenas varius, eros vitae eleifend maximus, sapien turpis varius urna, in iaculis est mauris sagittis nibh. Fusce et urna justo. Quisque in nibh eget magna vestibulum lacinia. Phasellus efficitur bibendum ante, eget laoreet dolor porta ut. Vestibulum aliquam nulla lectus, in volutpat massa aliquet eu.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc dictum sapien eget dui congue, et auctor lectus lacinia. Vivamus ac posuere urna, vitae pellentesque tortor. Curabitur condimentum, justo vel pellentesque tempus, dui quam rhoncus arcu, et ultrices ante est eu justo. Donec consectetur ac sem id feugiat. Vestibulum sodales vitae risus sit amet pulvinar. Nam sed justo in purus eleifend sodales. In blandit vel odio in vestibulum. Morbi viverra eros sit amet nulla aliquet aliquet. Vestibulum semper sed libero non dictum.
            Etiam auctor vitae nulla eu consequat. Maecenas sed tortor porttitor, viverra urna eget, pharetra tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nec velit suscipit, vehicula ex in, accumsan ligula. Vestibulum vehicula imperdiet tortor, sit amet dictum ipsum congue in. Duis cursus nunc non vulputate gravida. Etiam faucibus finibus iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse vel sapien iaculis dolor mattis iaculis. Nam felis nibh, facilisis at placerat vitae, lacinia sed arcu.`,
            isRead: false,
            isStarred: false,
            deletedAt: null,
            sentAt: 1593210401000,
            from: 'lorem@gmail.com',
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        },
    ]

    for (let i = 1; i <= 40; i++) {
        emails.push({
            id: utilService.makeId(),
            subject: 'Mass Email ' + i,
            body: 'This is some text for this sample email ' + i,
            isRead: false,
            isStarred: false,
            deletedAt: null,
            sentAt: 1670802055000 + i * 50000000,
            from: `mass_sender${i}@gmail.com`,
            to: 'keren.duchan@gmail.com',
            labelIds: [],
        })
    }

    utilService.saveToStorage(STORAGE_KEY, emails)
}

// expand the labelIds per email to also contain the label name
async function _expandLabelsOnEmails(emails) {
    let allLabels = await labelService.getAllLabels()

    emails.forEach((e) => {
        e.labels = []
        e.labelIds.forEach((labelId) =>
            e.labels.push({
                id: labelId,
                name: _getLabelNameById(labelId, allLabels),
            })
        )
    })
}

function _getLabelNameById(labelId, allLabels) {
    const found = allLabels.filter((l) => l.id === labelId)
    if (found.length === 0) {
        return null
    }
    return found[0].name
}
