import { useState } from 'react'
import { Dialog } from '../Dialog'

// Dialog for creating an email label
export function EmailLabelCreate({ label, onCloseClick, onSaveClick }) {
    // the about-to-be created label's name
    const [draft, setDraft] = useState(label || { name: '' })

    function onFormSubmit(ev) {
        ev.preventDefault()
        onSaveClick(draft)
    }

    function onNameChange(ev) {
        setDraft((prev) => ({ ...prev, name: ev.target.value }))
    }

    return (
        <Dialog
            title={label ? 'Edit Label' : 'New Label'}
            onCloseClick={onCloseClick}
        >
            <div className="email-label-create">
                <form
                    className="email-label-create-form"
                    onSubmit={onFormSubmit}
                >
                    <div className="email-label-create-form-field">
                        <label htmlFor="label-name">New label name:</label>
                        <input
                            autoFocus
                            type="text"
                            id="label-name"
                            onChange={onNameChange}
                            value={draft.name}
                        />
                    </div>
                </form>
                <div className="email-label-create-actions">
                    <button className="weak-action-btn" onClick={onCloseClick}>
                        Cancel
                    </button>
                    <button
                        className="strong-action-btn"
                        onClick={onFormSubmit}
                    >
                        {label ? 'Save' : 'Create'}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
