export function EmailComposeButton({ onComposeClick }) {
    return (
        <button
            className="large-button email-compose-button"
            onClick={onComposeClick}
        >
            Compose
        </button>
    )
}
