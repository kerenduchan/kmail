export { formatDate }

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-GB')
}
