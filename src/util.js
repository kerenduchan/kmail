export { formatDateConcise, formatDateVerbose }

function formatDateConcise(timestamp) {
    const now = new Date()
    const tsDate = new Date(timestamp)

    if (now.getFullYear() == tsDate.getFullYear()) {
        if (
            now.getMonth() == tsDate.getMonth() &&
            now.getDay() == tsDate.getDay()
        ) {
            // timestamp is today.
            return tsDate.toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit',
            })
        }
        // timestamp is this year, but before today.
        return tsDate.toLocaleDateString(navigator.language, {
            day: 'numeric',
            month: 'short',
        })
    }

    // timestamp is in the previous year or older
    return tsDate.toLocaleDateString(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function formatDateVerbose(timestamp) {
    const delta = Math.floor((new Date().getTime() - timestamp) / 1000)
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 31

    let verbose = ''
    if (delta < hour) {
        const minutesCount = Math.floor(delta / minute)
        verbose =
            minutesCount + ' minute' + (minutesCount === 1 ? '' : 's') + ' ago'
    } else if (delta < day) {
        const hoursCount = Math.floor(delta / hour)
        verbose = hoursCount + ' hour' + (hoursCount === 1 ? '' : 's') + ' ago'
    } else if (delta < month) {
        const daysCount = Math.floor(delta / day)
        verbose = daysCount + ' day' + (daysCount === 1 ? '' : 's') + ' ago'
    }
    // TODO: mimic gmail for older than a month ago

    let res = formatDateConcise(timestamp)
    if (verbose) {
        res += ' (' + verbose + ')'
    }
    return res
}
