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

async function query(filterBy) {
    let emails = await storageService.query(STORAGE_KEY)
    if (filterBy) {
        // TODO
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
        isRead: false,
        isStarred: false,
        sentAt: null,
        removedAt: null,
    }
}

function getDefaultFilter() {
    return {
        isRead: null,
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
                sentAt: null,
                removedAt: null,
            },
            {
                id: 'e2',
                subject: 'Test 2',
                body: 'This is the body of test 2',
                isRead: false,
                isStarred: true,
                sentAt: null,
                removedAt: null,
            },
            {
                id: 'e3',
                subject:
                    'This is a very long subject that should probably be shorter but for some reason it is just so long',
                body: 'This is the body of test 3',
                isRead: true,
                isStarred: false,
                sentAt: null,
                removedAt: null,
            },
        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}
