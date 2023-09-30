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
            <form onSubmit={onFormSubmit}>
                <label htmlFor="label-name">New label name:</label>
                <input
                    autoFocus
                    type="text"
                    id="label-name"
                    onChange={onNameChange}
                    value={name}
                />
            </form>
        </Dialog>
    )
}
