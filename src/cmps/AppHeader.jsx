import { NavLink } from 'react-router-dom'

export function AppHeader() {
    return (
        <header className="app-header">
            <h1>Mister Email</h1>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/email">Email</NavLink>
            </nav>
        </header>
    )
}
