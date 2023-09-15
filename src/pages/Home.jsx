import { Link } from 'react-router-dom'

export function Home() {
    return (
        <div class="home-page">
            <Link to="/email/inbox" class="large-button home-go-to-inbox">
                Go to inbox
            </Link>
        </div>
    )
}
