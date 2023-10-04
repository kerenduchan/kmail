function createEventEmitter() {
    const listenersMap = {}

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

export function showUserMsg(msg) {
    eventBusService.emit('show-user-msg', msg)
}

export function showSuccessMsg(txt) {
    showUserMsg({ txt, type: 'success' })
}

export function showErrorMsg(txt, err) {
    showUserMsg({ txt, type: 'error' })
    if (err) {
        console.error(txt)
        console.error(err)
    }
}

export function hideUserMsg() {
    eventBusService.emit('hide-user-msg')
}
