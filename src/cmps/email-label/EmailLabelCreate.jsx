import { useState } from 'react'
import { SmallActionButton } from '../SmallActionButton'

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
        // Dialog background
        <div className="email-label-create-dialog">
            <div className="email-label-create">
                {/* Title */}
                <div className="email-label-create-title">New Label</div>

                {/* Close button */}
                <SmallActionButton
                    type="close"
                    className="email-label-create-close-btn"
                    onClick={onCloseClick}
                ></SmallActionButton>

                {/* Form */}
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
            </div>
        </div>
    )
}
