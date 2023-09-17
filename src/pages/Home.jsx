import { Link } from 'react-router-dom'

export function Home() {
    return (
        <div className="home-page">
            <Link to="/email/inbox" className="large-button home-go-to-inbox">
                Go to inbox
            </Link>
        </div>
    )
}
