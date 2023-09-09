import { Link } from 'react-router-dom'

export function EmailSidebar() {
    return (
        <section className="email-sidebar">
            <Link
                className="email-sidebar-compose-button"
                to={'/email/compose'}
            >
                <button>Compose</button>
            </Link>
        </section>
    )
}
