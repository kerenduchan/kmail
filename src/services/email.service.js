import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmail,
    getDefaultFilter,
    getLoggedInUser,
    generateEmails,
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

    // folder
    if (filter.folder != 'bin' && email.isDeleted === true) {
        return false
    }

    switch (filter.folder) {
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
            return email.isDeleted === true
    }
    return true
}

async function query(filter) {
    let emails = await storageService.query(STORAGE_KEY)
    if (filter) {
        emails = emails.filter((email) => _doesEmailMatchFilter(email, filter))
        if (filter.folder != 'drafts') {
            emails = emails.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1))
        }
    }
    return emails
}

async function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(emailToSave) {
    if (emailToSave.id) {
        return storageService.put(STORAGE_KEY, emailToSave)
    } else {
        return storageService.post(STORAGE_KEY, emailToSave)
    }
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
        isDeleted: false,
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
            body: 'This is some text for this sample email',
            isRead: false,
            isStarred: false,
            isDeleted: false,
            sentAt: 1694112055000,
            from: 'moshe@gmail.com',
            to: 'keren.duchan@gmail.com',
        },
        {
            id: utilService.makeId(),
            subject: 'This is in the bin',
            body: 'This is some text for this sample email',
            isRead: true,
            isStarred: false,
            isDeleted: false,
            sentAt: 1694112055000,
            isDeleted: true,
            from: 'moshe@gmail.com',
            to: 'keren.duchan@gmail.com',
        },
        {
            id: utilService.makeId(),
            subject: 'Hi again',
            body: 'Would you like to talk?',
            isRead: true,
            isStarred: true,
            isDeleted: false,
            sentAt: 1693920361000,
            from: 'shoshana@gmail.com',
            to: 'keren.duchan@gmail.com',
        },
        {
            id: utilService.makeId(),
            subject:
                'This is a very long subject that should probably be shorter but for some reason it is just so long',
            body: 'This is the body of the email with the very long subject',
            isRead: true,
            isStarred: false,
            sentAt: 1593210401000,
            from: 'keren.duchan@gmail.com',
            to: 'shoshana@gmail.com',
        },
        {
            id: utilService.makeId(),
            subject: 'Some thoughts',
            body: 'Here are some thoughts...',
            isRead: true,
            isStarred: false,
            isDeleted: false,
            sentAt: null,
            from: 'keren.duchan@gmail.com',
            to: '',
        },
    ]

    for (let i = 1; i <= 50; i++) {
        emails.push({
            id: utilService.makeId(),
            subject: 'Mass Email ' + i,
            body: 'This is some text for this sample email ' + i,
            isRead: false,
            isStarred: false,
            isDeleted: false,
            sentAt: 1671802055000 + i * 50000000,
            from: `mass_sender${i}@gmail.com`,
            to: 'keren.duchan@gmail.com',
        })
    }

    utilService.saveToStorage(STORAGE_KEY, emails)
}
