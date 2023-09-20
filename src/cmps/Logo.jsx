import { useNavigate } from 'react-router-dom'

export function Logo() {
    const navigate = useNavigate()

    function onHeaderClicked() {
        navigate('/')
    }

    return (
        <header className="logo" onClick={onHeaderClicked}>
            <h1>Kmail</h1>
        </header>
    )
}
