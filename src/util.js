export { formatDate }

function formatDate(timestamp, isVerbose = false) {
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
