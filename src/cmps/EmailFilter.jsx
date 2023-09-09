import React, { useEffect, useState } from 'react'

const strToNullableBool = {
    true: true,
    false: false,
    null: null,
}

export function EmailFilter({ filter, onChange }) {
    function handleChange(ev) {
        let { value, name: field, type } = ev.target
        if (type === 'number') {
            value = +value
        } else if (['isRead', 'isStarred'].includes(field)) {
            value = strToNullableBool[value]
        }
        onChange({ [field]: value })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
    }

    function nullableBoolToStr(nb) {
        switch (nb) {
            case true:
                return 'true'
            case false:
                return 'false'
            case null:
            default:
                return 'null'
        }
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
                    value={nullableBoolToStr(filter.isStarred)}
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
                    value={filter.searchString}
                />
            </div>
        </form>
    )
}
