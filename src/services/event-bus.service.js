function createEventEmitter() {
    const listenersMap = {}
    // Trick for DEBUG
    // window.mapmap = listenersMap
    return {
        // Use this function to subscribe to an event
        on(evName, listener) {
            listenersMap[evName] = listenersMap[evName]
                ? [...listenersMap[evName], listener]
                : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(
                    (func) => func !== listener
                )
            }
        },
        // Use this function to emit an event
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach((listener) => listener(data))
        },
    }
}

export const eventBusService = createEventEmitter()
console.log('eventBusService', eventBusService)

////////////////////////////////////////////////////

// // Service Testing:
// // Example for using the service
// eventBusService.on('some-event', (data) => {
//     console.log('Got some-event:', data)
// })

// const unsubscribe = eventBusService.on('some-event', (data) => {
//     console.log('Me Too!', data)
// })

// eventBusService.emit('some-event', { num: 100 })
// setTimeout(() => eventBusService.emit('some-event', { num: 999 }), 3000)

// Just as example - unsubscribe after 2 secs
// setTimeout(() => {
//     unsubscribe()
// }, 2000)

// ///////////////////////////////////////////////////

// // For debug only
window.ebs = eventBusService
window.showSuccessMsg = showSuccessMsg
window.showErrorMsg = showErrorMsg

export function showUserMsg(msg) {
    eventBusService.emit('show-user-msg', msg)
}

export function showSuccessMsg(txt) {
    showUserMsg({ txt, type: 'success' })
}

export function showErrorMsg(txt) {
    showUserMsg({ txt, type: 'error' })
}
