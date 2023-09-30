import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'labels'

export const labelService = {
    getAllLabels,
    createLabel,
    deleteLabel,
}

async function getAllLabels() {
    return storageService.query(STORAGE_KEY)
}

async function createLabel(name) {
    return storageService.post(STORAGE_KEY, { name })
}

async function deleteLabel(id) {
    return storageService.remove(STORAGE_KEY, id)
}
