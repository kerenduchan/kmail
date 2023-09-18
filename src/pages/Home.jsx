import { Link, useNavigate } from 'react-router-dom'
import { emailService } from '../services/email.service'

export function Home() {
    const navigate = useNavigate()

    async function generateEmails() {
        await emailService.generateEmails()
        navigate('/email/inbox')
    }

    return (
        <div className="home-page">
            <Link to="/email/inbox" className="large-button home-go-to-inbox">
                Go to inbox
            </Link>
            <button
                className="large-button home-generate-emails-button"
                onClick={generateEmails}
            >
                Generate emails
            </button>
        </div>
    )
}
