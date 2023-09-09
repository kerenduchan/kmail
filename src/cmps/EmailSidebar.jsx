export function EmailSidebar({ onComposeClick }) {
    return (
        <section className="email-sidebar">
            <button onClick={onComposeClick}>Compose</button>
        </section>
    )
}
