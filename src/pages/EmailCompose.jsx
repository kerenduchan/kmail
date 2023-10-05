import { useState, useEffect, useRef } from 'react'
import { Formik, Form, Field, useFormikContext } from 'formik'
import { getEmailValidationSchema } from '../util/validation/emailValidation'

import { emailService } from '../services/email.service'
import { useSearchParams } from 'react-router-dom'
import { SmallActionButton } from '../cmps/SmallActionButton'

export function EmailCompose({ onCloseClick, onDeleteDraft, onSendEmail }) {
    const [draft, setDraft] = useState({ to: '', subject: '', body: '' })

    // Topbar title
    const [title, setTitle] = useState('New Message')

    // For managing minimized/fullscreen
    const [displayState, setDisplayState] = useState({
        isMinimized: false,
        isFullscreen: false,
    })

    const [searchParams, setSearchParams] = useSearchParams()

    // The full email, including id, isRead, etc.
    const email = useRef(null)

    useEffect(() => {
        handleSearchParamsChange()
    }, [searchParams])

    // TODO: debounce - save only when user isn't typing
    // useInterval(autoSaveDraft, 5000)

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

    async function onDraftCloseClick(values) {
        await emailService.updateEmail({ ...email.current, ...values })
        onCloseClick()
    }

    async function onFormSubmit(values) {
        await onSendEmail({ ...email.current, ...values })
        onCloseClick()
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

            // TODO await emailService.updateEmail(email.current)
        }

        if (id == null) {
            email.current = emailService.createEmail()
            email.current.isRead = true
        } else {
            // This is an attempt to edit an existing draft
            loadEmail(id)
        }
    }

    async function loadEmail(emailId) {
        email.current = await emailService.getEmailById(emailId)
        email.current.isRead = true
        setTitle(
            email.current.subject == '' ? 'New Message' : email.current.subject
        )
        setDraft(email.current)
    }

    function Input(props) {
        return (
            <>
                <label htmlFor={props.id}>{props.label}</label>
                <input autoFocus {...props} />
            </>
        )
    }

    function TextArea(props) {
        return <textarea {...props} />
    }

    if (!email.current) return <></>

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
                {/* Formik form must encompass topbar in order for form values 
                to be accessible to onCloseClick */}
                <Formik
                    initialValues={draft}
                    enableReinitialize
                    validationSchema={getEmailValidationSchema()}
                    onSubmit={onFormSubmit}
                >
                    {({ errors, touched, values }) => (
                        <Form className="email-compose-formik-form">
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
                                        onClick={() =>
                                            onDraftCloseClick(values)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="email-compose-form">
                                {/* To */}
                                <div
                                    className={`email-compose-field ${
                                        errors.to && touched.to ? 'errors' : ''
                                    }`}
                                >
                                    <Field
                                        as={Input}
                                        name="to"
                                        id="email-compose-to"
                                        label="To:"
                                    />

                                    {/* Errors */}
                                    <div className="errors">{errors.to}</div>
                                </div>
                                {/* Subject */}
                                <div className="email-compose-field">
                                    <Field
                                        as={Input}
                                        name="subject"
                                        id="email-compose-subject"
                                        label="Subject:"
                                    />
                                </div>
                                {/* Body */}
                                <div className="email-compose-field body">
                                    <Field
                                        as={TextArea}
                                        name="body"
                                        id="email-compose-body"
                                    />
                                </div>
                                <div className="email-compose-actions">
                                    {/* Send */}
                                    <button
                                        type="submit"
                                        className="strong-action-btn email-compose-action-send"
                                    >
                                        Send
                                    </button>

                                    {/* Delete */}
                                    <SmallActionButton
                                        type="delete"
                                        onClick={() =>
                                            onDeleteDraft(email.current.id)
                                        }
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
