import React, { useEffect, useState } from 'react'

export function EmailFilter({ filter, onSetFilter }) {
    const [filterDraft, setFilterDraft] = useState(filter)

    useEffect(() => {
        onSetFilter(filterDraft)
    }, [filterDraft])

    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') {
            value = +value
        } else if (field === 'isRead') {
            if (value == 'true') value = true
            if (value == 'false') value = false
            if (value == 'null') value = null
        }
        setFilterDraft((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
    }

    return (
        <form className="email-filter" onSubmit={onSubmitFilter}>
            <label htmlFor="isRead">Read:</label>
            <select
                name="isRead"
                id="isRead"
                onChange={handleChange}
                value={'' + filterDraft.isRead}
            >
                <option value="true">Read</option>
                <option value="false">Unread</option>
                <option value="null">All</option>
            </select>
        </form>
    )
}
