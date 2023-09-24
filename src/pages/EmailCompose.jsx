import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { getContainingFolder } from '../util'
import { emailService } from '../services/email.service'
import { useInterval } from '../useInterval'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function EmailCompose() {
    const [draft, setDraft] = useState(emailService.createEmail())
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()

    useEffect(() => {
        init()
    }, [])

    useInterval(autoSaveDraft, 5000)

    async function init() {
        if (params.emailId) {
            // this is an attempt to edit a draft
            await loadEmail(params.emailId)
        }
        setDraft((prev) => {
            return { ...prev, isRead: true }
        })
    }

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
        showSuccessMsg('Sending email...')
        try {
            await emailService.save(draft)
            navigate(getContainingFolder(location.pathname))
            showSuccessMsg('Email sent.')
        } catch (e) {
            showErrorMsg('Failed to send email.')
        }
    }

    async function onSaveDraft() {
        await emailService.save(draft)
        navigate(getContainingFolder(location.pathname))
    }

    async function autoSaveDraft() {
        const email = await emailService.save(draft)
        if (draft.id === null) {
            setDraft((prev) => {
                return { ...prev, id: email.id }
            })
            navigate(location.pathname + '/' + email.id)
        }
    }

    return (
        <div className="email-compose">
            <form className="email-compose-form" onSubmit={onSubmit}>
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
                <div className="email-compose-field body">
                    <textarea
                        id="email-compose-body"
                        name="body"
                        onChange={onChange}
                        value={draft.body}
                    />
                </div>

                <div className="email-compose-actions">
                    <button
                        className="email-compose-action-send"
                        onClick={onSend}
                    >
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
        </div>
    )
}
