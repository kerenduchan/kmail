import { strToNullableBool } from '../util/util'
export function EmailFilter({ filter, onChange }) {
    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') {
            value = +value
        } else if (['isRead', 'isStarred'].includes(field)) {
            value = strToNullableBool(value)
        }
        onChange({ [field]: value })
    }

    return (
        <form className="email-filter" onSubmit={(ev) => ev.preventDefault()}>
            {/* Read */}
            <div className="email-filter-field">
                <label htmlFor="isRead">Read:</label>
                <select
                    name="isRead"
                    id="isRead"
                    onChange={handleChange}
                    value={'' + filter.isRead}
                >
                    <option value={'null'}>All</option>
                    <option value={'true'}>Read</option>
                    <option value={'false'}>Unread</option>
                </select>
            </div>
            {/* Starred */}
            <div className="email-filter-field">
                <label htmlFor="isStarred">Starred:</label>
                <select
                    name="isStarred"
                    id="isStarred"
                    onChange={handleChange}
                    value={'' + filter.isStarred}
                >
                    <option value={'null'}>All</option>
                    <option value={'true'}>Starred</option>
                    <option value={'false'}>Unstarred</option>
                </select>
            </div>
            {/* Text search */}
            <div className="email-filter-field">
                <label htmlFor="searchString">Search:</label>
                <input
                    type="text"
                    id="searchString"
                    placeholder="Search by text"
                    name="searchString"
                    onChange={handleChange}
                    value={filter.searchString ? filter.searchString : ''}
                />
            </div>
        </form>
    )
}
