import { Link } from 'react-router-dom'

export function EmailPreview({ email, onUpdateEmail }) {
    function onStarClick(email) {
        const emailAfterUpdate = {
            ...email,
            isStarred: !email.isStarred,
        }
        onUpdateEmail(emailAfterUpdate)
    }

    return (
        <article className={'email-preview' + (email.isRead ? ' read' : '')}>
            <img
                className="email-preview-star-img"
                src={
                    'imgs/' +
                    (email.isStarred ? 'starred.svg' : 'unstarred.svg')
                }
                onClick={() => onStarClick(email)}
            />
            <Link to={`/email/${email.id}`}>
                <span className="email-preview-subject">{email.subject}</span>
            </Link>
        </article>
    )
}
