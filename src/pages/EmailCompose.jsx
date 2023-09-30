import { useState, useEffect, useRef } from 'react'
import { emailService } from '../services/email.service'
import { useInterval } from '../useInterval'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { useSearchParams } from 'react-router-dom'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailCompose({ onCloseClick, onDeleteDraft }) {
    // Two-way binding with the form fields
    const [draft, setDraft] = useState(null)

    // Topbar title
    const [title, setTitle] = useState('New Message')

    // For managing minimized/fullscreen
    const [displayState, setDisplayState] = useState({
        isMinimized: false,
        isFullscreen: false,
    })

    const [searchParams, setSearchParams] = useSearchParams()

    // The full email, including id, isRead, etc. Not part of the state for
    // synchronicity.
    const email = useRef(null)

    // Whether the email was edited since it was loaded
    const isEdited = useRef(false)

    useEffect(() => {
        handleSearchParamsChange()
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
        email.current[field] = value
        setDraft((prev) => ({ ...prev, [field]: value }))
        if (field == 'subject') {
            setTitle(value == '' ? 'New Message' : value)
        }
    }

    async function onSend() {
        showSuccessMsg('Sending email...')
        try {
            email.current = await emailService.sendEmail(email.current)
            onCloseClick()
            showSuccessMsg('Email sent.')
        } catch (e) {
            showErrorMsg('Failed to send email.')
        }
    }

    async function onDraftCloseClick() {
        if (isEdited.current) {
            await emailService.save(email.current)
        }
        onCloseClick()
    }

    async function autoSaveDraft() {
        if (isEdited.current === false) {
            return
        }
        const prevId = email.current.id
        email.current = await emailService.save(email.current)
        if (prevId === null) {
            setSearchParams((prev) => ({ ...prev, compose: email.current.id }))
        }
        setTitle('Draft saved')
    }

    async function handleSearchParamsChange() {
        const composeVal = searchParams.get('compose')
        const id = composeVal == 'new' ? null : composeVal

        if (email !== null) {
            // searchParams switched while the compose dialog was open
            setDisplayState((prev) => ({
                ...prev,
                isMinimized: false,
            }))

            if (isEdited.current) {
                await emailService.save(email.current)
            }
        }

        if (id == null) {
            email.current = emailService.createEmail()
            email.current.isRead = true
            setDraft(email.current)
        } else {
            // This is an attempt to edit an existing draft
            loadEmail(id)
        }
    }

    async function loadEmail(emailId) {
        email.current = await emailService.getById(emailId)
        email.current.isRead = true
        setDraft(email.current)
        setTitle(
            email.current.subject == '' ? 'New Message' : email.current.subject
        )
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
                <form
                    className="email-compose-form"
                    onSubmit={(ev) => ev.preventDefault()}
                >
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
                            className="strong-action-btn email-compose-action-send"
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
