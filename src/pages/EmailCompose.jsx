import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { emailService } from '../services/email.service'

export function EmailCompose() {
    const [draft, setDraft] = useState(emailService.createEmail())
    const navigate = useNavigate()
    const location = useLocation()

    function handleChange(ev) {
        let { value, name: field } = ev.target
        setDraft((prev) => ({ ...prev, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
    }

    async function onSend() {
        draft.sentAt = Date.now()
        await emailService.save(draft)
        navigateToContainingFolder()
    }

    async function onSaveDraft() {
        await emailService.save(draft)
        navigateToContainingFolder()
    }

    function navigateToContainingFolder() {
        navigate(location.pathname.split('/').slice(0, 3).join('/'))
    }

    return (
        <form className="email-compose" onSubmit={onSubmit}>
            {/* To */}
            <div className="email-compose-field">
                <label htmlFor="email-compose-to">To:</label>
                <input
                    type="text"
                    id="email-compose-to"
                    name="to"
                    onChange={handleChange}
                    value={draft.to}
                />
            </div>

            {/* Subject */}
            <div className="email-compose-field">
                <label htmlFor="email-compose-subject">Subject:</label>
                <input
                    type="text"
                    id="email-compose-subject"
                    name="subject"
                    onChange={handleChange}
                    value={draft.subject}
                />
            </div>

            {/* Body */}
            <div className="email-compose-field">
                <textarea
                    id="email-compose-body"
                    name="body"
                    onChange={handleChange}
                    value={draft.body}
                />
            </div>

            <div className="email-compose-actions">
                <button className="email-compose-action-send" onClick={onSend}>
                    Send
                </button>
                <button
                    className="email-compose-action-save-draft"
                    onClick={onSaveDraft}
                >
                    Save Draft
                </button>
            </div>
        </form>
    )
}
