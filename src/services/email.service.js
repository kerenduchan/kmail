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
}

const loggedinUser = {
    email: 'keren.duchan@gmail.com',
    fullname: 'Keren Duchan',
}

const STORAGE_KEY = 'emails'

function getLoggedInUser() {
    return loggedinUser
}

_createEmails()

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
    if (filter.folder) {
        if (
            filter.folder == 'inbox' &&
            email.to != emailService.getLoggedInUser().email
        ) {
            return false
        }
        if (
            filter.folder == 'sent' &&
            email.from != emailService.getLoggedInUser().email
        ) {
            return false
        }
        if (filter.folder == 'drafts' && email.sentAt != null) {
            return false
        }
        if (filter.folder == 'all' && email.sentAt == null) {
            return false
        }
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
        removedAt: null,
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

function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (!emails || !emails.length) {
        emails = [
            {
                id: 'e1',
                subject: 'Test 1',
                body: 'This is the body of test 1',
                isRead: false,
                isStarred: false,
                sentAt: 1694112055000,
                removedAt: null,
                from: 'moshe@gmail.com',
                to: 'keren.duchan@gmail.com',
            },
            {
                id: 'e2',
                subject: 'Test 2',
                body: 'This is the body of test 2',
                isRead: false,
                isStarred: true,
                sentAt: 1693920361000,
                removedAt: null,
                from: 'shoshana@gmail.com',
                to: 'keren.duchan@gmail.com',
            },
            {
                id: 'e3',
                subject:
                    'This is a very long subject that should probably be shorter but for some reason it is just so long',
                body: 'This is the body of test 3',
                isRead: true,
                isStarred: false,
                sentAt: 1593210401000,
                removedAt: null,
                from: 'keren.duchan@gmail.com',
                to: 'shoshana@gmail.com',
            },
        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}
