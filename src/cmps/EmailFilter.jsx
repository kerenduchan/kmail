import { nullableBoolToStr, strToNullableBool } from '../util'

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

    function onSubmitFilter(ev) {
        ev.preventDefault()
    }

    return (
        <form className="email-filter" onSubmit={onSubmitFilter}>
            {/* Read */}
            <div className="email-filter-field">
                <label htmlFor="isRead">Read:</label>
                <select
                    name="isRead"
                    id="isRead"
                    onChange={handleChange}
                    value={nullableBoolToStr(filter.isRead)}
                >
                    <option value={nullableBoolToStr(null)}>All</option>
                    <option value={nullableBoolToStr(true)}>Read</option>
                    <option value={nullableBoolToStr(false)}>Unread</option>
                </select>
            </div>
            {/* Starred */}
            <div className="email-filter-field">
                <label htmlFor="isStarred">Starred:</label>
                <select
                    name="isStarred"
                    id="isStarred"
                    onChange={handleChange}
                    value={nullableBoolToStr(filter.isStarred)}
                >
                    <option value={nullableBoolToStr(null)}>All</option>
                    <option value={nullableBoolToStr(true)}>Starred</option>
                    <option value={nullableBoolToStr(false)}>Unstarred</option>
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
                    value={filter.searchString}
                />
            </div>
        </form>
    )
}
