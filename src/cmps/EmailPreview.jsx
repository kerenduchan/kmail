import { Link } from 'react-router-dom'

export function EmailPreview({ email }) {
    function getStarImg() {
        return 'imgs/' + (email.isStarred ? 'starred.svg' : 'unstarred.svg')
    }

    return (
        <article className="email-preview">
            <Link to={`/email/${email.id}`}>
                <img
                    className="email-star-img"
                    src={getStarImg(email.isStarred)}
                />
                <span class="email-preview-subject">{email.subject}</span>
            </Link>
        </article>
    )
}
