import { getAllFolders } from '../util'

export function EmailFolders({
    activeFolder,
    onFolderClick,
    className,
    emailCounts,
}) {
    function getClassName(folder) {
        return (
            `email-folder ${folder}` + (activeFolder == folder ? ' active' : '')
        )
    }

    function getCount(folder) {
        const counts = emailCounts[folder]
        return folder == 'drafts' ? counts.total : counts.unread
    }

    const folders = getAllFolders()

    return (
        <section
            className={'email-folders' + (className ? ` ${className}` : '')}
        >
            {folders.map((folder) => {
                return (
                    <a
                        key={folder.id}
                        className={getClassName(folder.id)}
                        onClick={() => onFolderClick(folder.id)}
                    >
                        <div
                            className={
                                'email-folder-name' +
                                (getCount(folder.id) ? ' has-count' : '')
                            }
                        >
                            {folder.name}
                        </div>
                        <div className="email-folder-count">
                            {getCount(folder.id) || ''}
                        </div>
                    </a>
                )
            })}
        </section>
    )
}
