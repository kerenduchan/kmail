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
            return tsDate.getHours() + ':' + tsDate.getMinutes()
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

    let verbose = ''
    if (delta < minute) {
        verbose = 'now'
    } else if (delta < 2 * minute) {
        verbose = '1 minute ago'
    } else if (delta < hour) {
        verbose = Math.floor(delta / minute) + ' minutes ago'
    } else if (Math.floor(delta / hour) == 1) {
        verbose = '1 hour ago'
    } else if (delta < day) {
        verbose = Math.floor(delta / hour) + ' hours ago'
    } else if (delta < day * 2) {
        verbose = '1 day ago'
    }

    let res = formatDateConcise(timestamp)
    if (verbose) {
        res += ' (' + verbose + ')'
    }
    return res
}
