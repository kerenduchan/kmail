export function Modal({ show, onClose, renderComponent }) {
    return (
        <div className={'modal' + (show ? ' show' : '')}>
            <div className="modal-content">
                {renderComponent}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
