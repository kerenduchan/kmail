import React, { useEffect, useState } from 'react'

const translateNullableBool = {
    true: true,
    false: false,
    null: null,
}

export function EmailFilter({ filter, onSetFilter }) {
    const [filterDraft, setFilterDraft] = useState(filter)

    useEffect(() => {
        onSetFilter(filterDraft)
    }, [filterDraft])

    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') {
            value = +value
        } else if (['isRead', 'isStarred'].includes(field)) {
            value = translateNullableBool[value]
        }
        setFilterDraft((prevFilter) => ({ ...prevFilter, [field]: value }))
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
                    value={'' + filterDraft.isRead}
                >
                    <option value="null">All</option>
                    <option value="true">Read</option>
                    <option value="false">Unread</option>
                </select>
            </div>
            {/* Starred */}
            <div className="email-filter-field">
                <label htmlFor="isStarred">Starred:</label>
                <select
                    name="isStarred"
                    id="isStarred"
                    onChange={handleChange}
                    value={'' + filterDraft.isStarred}
                >
                    <option value="null">All</option>
                    <option value="true">Starred</option>
                    <option value="false">Unstarred</option>
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
                    value={filterDraft.searchString}
                />
            </div>
        </form>
    )
}
