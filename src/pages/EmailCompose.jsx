import { useState } from 'react'
import { useNavigate } from 'react-router'
import { emailService } from '../services/email.service'

export function EmailCompose() {
    const [draft, setDraft] = useState(emailService.createEmail())
    const navigate = useNavigate()

    function handleChange(ev) {
        let { value, name: field } = ev.target
        setDraft((prev) => ({ ...prev, [field]: value }))
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        draft.sentAt = Date.now()
        await emailService.save(draft)
        navigate('/email')
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
                <input
                    type="submit"
                    value="Send"
                    className="email-compose-action-send"
                />
            </div>
        </form>
    )
}
