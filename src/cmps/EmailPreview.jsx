import { useState } from 'react'
import { Link } from 'react-router-dom'

const MAX_SUBJECT_LEN = 80

export function EmailPreview({ email, onUpdateEmail }) {
    const [isActive, setIsActive] = useState(false)

    function onStarClick(email) {
        const emailAfterUpdate = {
            ...email,
            isStarred: !email.isStarred,
        }
        onUpdateEmail(emailAfterUpdate)
    }

    function getTruncatedSubject() {
        return email.subject.length <= MAX_SUBJECT_LEN
            ? email.subject
            : email.subject.substring(0, MAX_SUBJECT_LEN).trimEnd() + '...'
    }

    return (
        <article
            className={
                'email-preview' +
                (email.isRead ? ' read' : '') +
                (isActive ? ' hover' : '')
            }
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
                <span>{getTruncatedSubject()}</span>
            </Link>
        </article>
    )
}
