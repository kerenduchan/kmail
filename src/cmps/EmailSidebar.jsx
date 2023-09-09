import { Link, useLocation } from 'react-router-dom'

export function EmailSidebar() {
    const location = useLocation()

    function getClassName(folder) {
        return (
            'email-sidebar-folder' +
            (location.pathname.split('/')[2] == folder ? ' active' : '')
        )
    }

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
                <Link to={'/email/inbox'} className={getClassName('inbox')}>
                    Inbox
                </Link>

                {/* Sent */}
                <Link to={'/email/sent'} className={getClassName('sent')}>
                    Sent
                </Link>

                {/* All Mail */}
                <Link to={'/email/all'} className={getClassName('all')}>
                    All Mail
                </Link>
            </section>
        </section>
    )
}
