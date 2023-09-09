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
                <Link
                    className="email-sidebar-folder-inbox"
                    to={'/email/inbox'}
                >
                    Inbox
                </Link>
            </section>
        </section>
    )
}
