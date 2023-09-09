import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmail,
    getDefaultFilter,
}

const loggedinUser = {
    email: 'keren.duchan@gmail.com',
    fullname: 'Keren Duchan',
}

const STORAGE_KEY = 'emails'

_createEmails()

async function query(filter) {
    const lowercaseSearchString = filter.searchString.toLowerCase()
    let emails = await storageService.query(STORAGE_KEY)
    if (filter) {
        emails = emails.filter(
            (email) =>
                (filter.isRead === null || email.isRead === filter.isRead) &&
                (filter.isStarred === null ||
                    email.isStarred === filter.isStarred) &&
                (filter.searchString === '' ||
                    email.subject
                        .toLowerCase()
                        .includes(lowercaseSearchString) ||
                    email.body.toLowerCase().includes(lowercaseSearchString))
        )
    }
    return emails
}

function getById(id) {
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
