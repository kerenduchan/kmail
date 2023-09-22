export {
    getHourAndMinuteStr,
    formatDateConcise,
    formatDateVerbose,
    strToNullableBool,
    getAllFolders,
    getAllFolderIds,
    getContainingFolder,
    getEmailFilterFromParams,
    sanitizeFilter,
    getDefaultFilter,
}

function getHourAndMinuteStr(date) {
    return date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatDateConcise(timestamp) {
    const now = new Date()
    const tsDate = new Date(timestamp)

    if (now.getFullYear() == tsDate.getFullYear()) {
        if (
            now.getMonth() == tsDate.getMonth() &&
            now.getDay() == tsDate.getDay()
        ) {
            // timestamp is today.
            return getHourAndMinuteStr(tsDate)
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
    const tsDate = new Date(timestamp)

    const delta = Math.floor((new Date().getTime() - timestamp) / 1000)
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 31

    let res = ''
    let relative = ''
    if (delta < hour) {
        const minutesCount = Math.floor(delta / minute)
        return getHourAndMinuteStr(tsDate)
    } else if (delta < day) {
        res = getHourAndMinuteStr(tsDate)
        const hoursCount = Math.floor(delta / hour)
        relative = hoursCount + ' hour' + (hoursCount === 1 ? '' : 's') + ' ago'
    } else if (delta < month) {
        res = tsDate.toLocaleDateString(navigator.language, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
        const daysCount = Math.floor(delta / day)
        relative = daysCount + ' day' + (daysCount === 1 ? '' : 's') + ' ago'
    } else {
        res = tsDate.toLocaleDateString(navigator.language, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }
    // TODO: mimic gmail for several months ago

    if (relative) {
        res += ' (' + relative + ')'
    }
    return res
}

const nullableBool = {
    true: true,
    false: false,
    null: null,
}

function strToNullableBool(str) {
    if (nullableBool[str] !== undefined) {
        return nullableBool[str]
    }
    return null
}

const folders = [
    {
        id: 'inbox',
        name: 'Inbox',
    },
    {
        id: 'sent',
        name: 'Sent',
    },
    {
        id: 'drafts',
        name: 'Drafts',
    },
    {
        id: 'starred',
        name: 'Starred',
    },
    {
        id: 'all',
        name: 'All Mail',
    },
    {
        id: 'bin',
        name: 'Bin',
    },
]

function getAllFolders() {
    return folders
}

function getAllFolderIds() {
    return folders.map((f) => f.id)
}

function getContainingFolder(path) {
    return path.split('/').slice(0, 3).join('/')
}

function getEmailFilterFromParams(params, searchParams) {
    const searchString = searchParams.get('search')

    return {
        isRead: strToNullableBool(searchParams.get('isRead')),
        isStarred: strToNullableBool(searchParams.get('isStarred')),
        searchString: searchString ? searchString : '',
        folder: params.folderId,
    }
}

function getDefaultFilter() {
    return {
        isRead: null,
        isStarred: null,
        searchString: '',
    }
}

function sanitizeFilter(filter) {
    const sanitizedFilter = {}

    if (filter.isRead !== null) {
        sanitizedFilter.isRead = filter.isRead
    }
    if (filter.isStarred !== null) {
        sanitizedFilter.isStarred = filter.isStarred
    }
    if (filter.searchString) {
        sanitizedFilter.searchString = filter.searchString
    }
    return sanitizedFilter
}
