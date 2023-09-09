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

            <section className="email-sidebar-folders">
                {/* Inbox */}
                <Link to={'/email/inbox'}>Inbox</Link>

                {/* Sent */}
                <Link to={'/email/sent'}>Sent</Link>

                {/* All Mail */}
                <Link to={'/email/all'}>All Mail</Link>
            </section>
        </section>
    )
}
