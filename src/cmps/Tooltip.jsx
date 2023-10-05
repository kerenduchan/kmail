export function Tooltip({ children, text }) {
    return (
        <div className="tooltip">
            {children}
            <span className="tooltip-text">{text}</span>
        </div>
    )
}
