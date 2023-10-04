import { getAllFolders } from '../util/util'

export function EmailFolders({
    activeFolderId,
    onFolderClick,
    className,
    emailCounts,
}) {
    function getClassName(folderId) {
        return (
            `email-folder ${folderId}` +
            (activeFolderId == folderId ? ' active' : '')
        )
    }

    function getCount(folderId) {
        const counts = emailCounts[folderId]
        return folderId == 'drafts' ? counts.total : counts.unread
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
