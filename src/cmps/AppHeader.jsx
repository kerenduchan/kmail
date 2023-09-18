import { useNavigate } from 'react-router-dom'

export function AppHeader() {
    const navigate = useNavigate()

    function onHeaderClicked() {
        navigate('/')
    }

    return (
        <header className="app-header" onClick={onHeaderClicked}>
            <h1>Kmail</h1>
        </header>
    )
}
