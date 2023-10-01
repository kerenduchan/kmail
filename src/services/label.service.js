import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'labels'

export const labelService = {
    getAllLabels,
    createLabel,
    updateLabel,
    deleteLabel,
}

async function getAllLabels() {
    return storageService.query(STORAGE_KEY)
}

async function createLabel(label) {
    return storageService.post(STORAGE_KEY, label)
}

async function updateLabel(label) {
    return storageService.put(STORAGE_KEY, label)
}

async function deleteLabel(id) {
    return storageService.remove(STORAGE_KEY, id)
}
