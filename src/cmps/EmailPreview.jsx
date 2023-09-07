import { useState } from 'react'
import { Link } from 'react-router-dom'

const MAX_SUBJECT_LEN = 80

export function EmailPreview({ email, onUpdateEmail }) {
    function onStarClick(email) {
        const emailAfterUpdate = {
            ...email,
            isStarred: !email.isStarred,
        }
        onUpdateEmail(emailAfterUpdate)
    }

    return (
        <article
            className={'email-preview' + (email.isRead ? ' read' : '')}
            onMouseOver={() => setIsActive(true)}
            onMouseOut={() => setIsActive(false)}
        >
            <img
                className="email-preview-star-img"
                src={
                    'imgs/' +
                    (email.isStarred ? 'starred.svg' : 'unstarred.svg')
                }
                onClick={() => onStarClick(email)}
            />
            <Link className="email-preview-link" to={`/email/${email.id}`}>
                <div className="email-preview-subject">{email.subject}</div>
            </Link>
        </article>
    )
}
