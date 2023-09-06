import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function EmailPreview({ email, onUpdateEmail }) {
    const [isActive, setIsActive] = useState(false)

    function onStarClick(email) {
        const emailAfterUpdate = {
            ...email,
            isStarred: !email.isStarred,
        }
        onUpdateEmail(emailAfterUpdate)
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
                <span>{email.subject}</span>
            </Link>
        </article>
    )
}
