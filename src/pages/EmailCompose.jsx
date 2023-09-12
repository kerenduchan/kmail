import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { getContainingFolder } from '../util'
import { emailService } from '../services/email.service'

export function EmailCompose() {
    const [draft, setDraft] = useState(emailService.createEmail())
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()

    useEffect(() => {
        if (params.emailId) {
            // this is an attempt to edit a draft
            loadEmail(params.emailId)
        }
    }, [])

    async function loadEmail(emailId) {
        const email = await emailService.getById(emailId)
        setDraft(email)
    }

    function onChange(ev) {
        let { value, name: field } = ev.target
        setDraft((prev) => ({ ...prev, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
    }

    async function onSend() {
        draft.sentAt = Date.now()
        await emailService.save(draft)
        navigate(getContainingFolder(location.pathname))
    }

    async function onSaveDraft() {
        await emailService.save(draft)
        navigate(getContainingFolder(location.pathname))
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
                    onChange={onChange}
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
                    onChange={onChange}
                    value={draft.subject}
                />
            </div>

            {/* Body */}
            <div className="email-compose-field">
                <textarea
                    id="email-compose-body"
                    name="body"
                    onChange={onChange}
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
