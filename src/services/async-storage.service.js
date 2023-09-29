export const storageService = {
    query,
    get,
    post,
    put,
    putMany,
    remove,
    removeMany,
}

function query(entityType, delay = 200) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise((resolve) => setTimeout(() => resolve(entities), delay))
}

function get(entityType, entityId) {
    return query(entityType).then((entities) => {
        const entity = entities.find((entity) => entity.id === entityId)
        if (!entity)
            throw new Error(
                `Get failed, cannot find entity with id: ${entityId} in: ${entityType}`
            )
        return entity
    })
}

function post(entityType, newEntity) {
    newEntity = { ...newEntity }
    newEntity.id = _makeId()
    return query(entityType).then((entities) => {
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

function put(entityType, updatedEntity) {
    return query(entityType).then((entities) => {
        const idx = entities.findIndex(
            (entity) => entity.id === updatedEntity.id
        )
        if (idx < 0)
            throw new Error(
                `Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`
            )
        entities.splice(idx, 1, updatedEntity)
        _save(entityType, entities)
        return updatedEntity
    })
}

function putMany(entityType, updatedEntities) {
    return query(entityType).then((entities) => {
        const updatedEntityIds = updatedEntities.map((e) => e.id)
        entities = entities.filter((e) => !updatedEntityIds.includes(e.id))
        entities = entities.concat(updatedEntities)
        _save(entityType, entities)
    })
}

function remove(entityType, entityId) {
    return query(entityType).then((entities) => {
        const idx = entities.findIndex((entity) => entity.id === entityId)
        if (idx < 0)
            throw new Error(
                `Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`
            )
        entities.splice(idx, 1)
        _save(entityType, entities)
    })
}

function removeMany(entityType, entityIds) {
    return query(entityType).then((entities) => {
        entities.filter((e) => !entityIds.includes(e.id))
        _save(
            entityType,
            entities.filter((e) => !entityIds.includes(e.id))
        )
    })
}

// Private functions

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
