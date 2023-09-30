import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'labels'

export const labelService = {
    getAllLabels,
    createLabel,
}

async function getAllLabels() {
    return storageService.query(STORAGE_KEY)
}

async function createLabel(name) {
    return storageService.post(STORAGE_KEY, { name })
}
