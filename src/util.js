export { formatDate }

function formatDate(timestamp) {
    const delta = Math.floor((new Date().getTime() - timestamp) / 1000)
    const minute = 60
    const hour = minute * 60
    const day = hour * 24

    if (delta < minute) {
        return 'now'
    } else if (delta < 2 * minute) {
        return 'a minute ago'
    } else if (delta < hour) {
        return Math.floor(delta / minute) + ' minutes ago'
    } else if (Math.floor(delta / hour) == 1) {
        return '1 hour ago'
    } else if (delta < day) {
        return Math.floor(delta / hour) + ' hours ago'
    } else if (delta < day * 2) {
        return 'yesterday'
    }

    return new Date(timestamp).toLocaleDateString('en-GB')
}
