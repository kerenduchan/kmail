import { useState } from 'react'
import { Dialog } from '../Dialog'

// Dialog for creating an email label
export function EmailLabelCreate({ onCloseClick, onSave }) {
    // the about-to-be created label's name
    const [name, setName] = useState('')

    function onFormSubmit(ev) {
        ev.preventDefault()
        onSave(name)
    }

    function onNameChange(ev) {
        setName(ev.target.value)
    }

    return (
        <Dialog title="New Label" onCloseClick={onCloseClick}>
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
                            value={name}
                        />
                    </div>
                </form>
                <div className="email-label-create-actions">
                    <button
                        className="strong-action-btn"
                        onClick={onFormSubmit}
                    >
                        Create
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
