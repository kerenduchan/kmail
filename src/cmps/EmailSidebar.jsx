import { getAllFolders } from '../util'

export function EmailSidebar({ activeFolder, onFolderClick, onComposeClick }) {
    function getClassName(folder) {
        return (
            'email-sidebar-folder' + (activeFolder == folder ? ' active' : '')
        )
    }

    const folders = getAllFolders()

    return (
        <section className="email-sidebar">
            <button
                className="email-sidebar-compose-button"
                onClick={onComposeClick}
            >
                Compose
            </button>

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
