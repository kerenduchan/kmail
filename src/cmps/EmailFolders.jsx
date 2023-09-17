import { getAllFolders } from '../util'

export function EmailFolders({ activeFolder, onFolderClick, className }) {
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
                        {folder.name}
                    </a>
                )
            })}
        </section>
    )
}
