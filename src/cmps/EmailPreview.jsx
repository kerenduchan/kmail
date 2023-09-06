import { Link } from 'react-router-dom'

export function EmailPreview({ email }) {
    function getStarImg() {
        return 'imgs/' + (email.isStarred ? 'starred.svg' : 'unstarred.svg')
    }

    return (
        <Link to={`/email/${email.id}`}>
            <article className="email-preview">
                <img
                    className="email-preview-star-img"
                    src={getStarImg(email.isStarred)}
                />
                <span class="email-preview-subject">{email.subject}</span>
            </article>
        </Link>
    )
}
