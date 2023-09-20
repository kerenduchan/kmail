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
                                (emailCounts[folder.id].unread
                                    ? ' has-unread'
                                    : '')
                            }
                        >
                            {folder.name}
                        </div>
                        <div className="email-folder-unread-count">
                            {emailCounts[folder.id].unread || ''}
                        </div>
                    </a>
                )
            })}
        </section>
    )
}
