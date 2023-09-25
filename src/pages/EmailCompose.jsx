import { useState, useEffect, useRef } from 'react'
import { emailService } from '../services/email.service'
import { useInterval } from '../useInterval'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { useSearchParams } from 'react-router-dom'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailCompose({ onCloseClick, onDeleteDraft }) {
    const [draft, setDraft] = useState(null)
    const [title, setTitle] = useState('New Message')
    const [displayState, setDisplayState] = useState({
        isMinimized: false,
        isFullscreen: false,
    })
    const [searchParams, setSearchParams] = useSearchParams()
    const isEdited = useRef(false)
    const emailId = useRef(null)

    useEffect(() => {
        const composeVal = searchParams.get('compose')
        emailId.current = composeVal == 'new' ? null : composeVal
        if (emailId.current == null) {
            setDraft(emailService.createEmail())
        } else {
            // this is an attempt to edit a draft
            loadEmail(emailId.current)
        }
    }, [searchParams])

    useInterval(autoSaveDraft, 5000)

    function onMinimizeClick() {
        setDisplayState((prev) => {
            return { ...prev, isMinimized: !prev.isMinimized }
        })
    }

    function onFullscreenClick() {
        setDisplayState((prev) => {
            return {
                isMinimized: false,
                isFullscreen: !prev.isFullscreen,
            }
        })
    }

    function onChange(ev) {
        isEdited.current = true
        let { value, name: field } = ev.target
        setDraft((prev) => ({ ...prev, [field]: value }))
        if (field == 'subject') {
            setTitle(value == '' ? 'New Message' : value)
        }
    }

    function onSubmit(ev) {
        ev.preventDefault()
    }

    async function onSend() {
        draft.sentAt = Date.now()
        showSuccessMsg('Sending email...')
        try {
            await emailService.save(draft)
            onCloseClick()
            showSuccessMsg('Email sent.')
        } catch (e) {
            showErrorMsg('Failed to send email.')
        }
    }

    async function onDraftCloseClick() {
        if (isEdited.current) {
            await emailService.save(draft)
        }
        onCloseClick()
    }

    async function autoSaveDraft() {
        if (isEdited.current === false) {
            return
        }
        const email = await emailService.save({ ...draft, id: emailId.current })
        if (emailId.current === null) {
            emailId.current = email.id
            setSearchParams((prev) => ({ ...prev, compose: emailId.current }))
        }
        setTitle('Draft saved')
    }

    async function loadEmail(emailId) {
        const email = await emailService.getById(emailId)
        setDraft({ ...email, isRead: true })
    }

    if (!draft) return <></>

    return (
        <div
            className={
                'email-compose-dialog' +
                (displayState.isMinimized ? ' minimized' : '') +
                (!displayState.isMinimized && displayState.isFullscreen
                    ? ' fullscreen'
                    : '')
            }
        >
            <div className="email-compose">
                {/* Topbar */}
                <div className="email-compose-topbar">
                    <div
                        className="email-compose-topbar-title"
                        onClick={onMinimizeClick}
                    >
                        {title}
                    </div>
                    <div className="email-compose-topbar-actions">
                        <div
                            className="email-compose-topbar-action minimize"
                            onClick={onMinimizeClick}
                        />
                        <div
                            className={
                                'email-compose-topbar-action ' +
                                (displayState.isFullscreen
                                    ? 'exit-fullscreen'
                                    : 'fullscreen')
                            }
                            onClick={onFullscreenClick}
                        />
                        <div
                            className="email-compose-topbar-action close"
                            onClick={onDraftCloseClick}
                        />
                    </div>
                </div>

                {/* Form */}
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
                        {/* Send */}
                        <button
                            className="email-compose-action-send"
                            onClick={onSend}
                        >
                            Send
                        </button>

                        {/* Delete */}
                        <SmallActionButton
                            type="delete"
                            onClick={() => onDeleteDraft(draft.id)}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
