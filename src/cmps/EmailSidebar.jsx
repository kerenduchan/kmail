import { useLocation } from 'react-router-dom'

export function EmailSidebar({ onFolderClick }) {
    const location = useLocation()

    function getClassName(folder) {
        return (
            'email-sidebar-folder' +
            (location.pathname.split('/')[2] == folder ? ' active' : '')
        )
    }

    const folders = [
        {
            id: 'inbox',
            name: 'Inbox',
        },
        {
            id: 'sent',
            name: 'Sent',
        },
        {
            id: 'all',
            name: 'All Mail',
        },
    ]

    return (
        <section className="email-sidebar">
            <a className="email-sidebar-compose-button" to={'/email/compose'}>
                <button>Compose</button>
            </a>

            <section className="email-sidebar-folders">
                {folders.map((folder) => {
                    return (
                        <a
                            key={folder.id}
                            to={`/email/${folder.id}`}
                            className={getClassName(folder.id)}
                            onClick={() => onFolderClick(folder.id)}
                        >
                            {folder.name}
                        </a>
                    )
                })}
            </section>
        </section>
    )
}
