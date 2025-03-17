import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
	const modalRef = useRef(null);
	const closeButtonRef = useRef(null);

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		const handleClickOutside = (e) => {
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.addEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "hidden";
			closeButtonRef.current?.focus(); // Focus the close button when the modal opens
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "auto";
		};
	}, [isOpen, onClose]);

	// Ensure modal has aria-hidden and screen readers do not focus on behind content when modal is open
	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay} aria-hidden={!isOpen}>
			<div
				className={`${styles.modalContainer} ${styles[size]}`}
				ref={modalRef}
				aria-modal="true"
				role="dialog"
				aria-labelledby="modal-title"
				tabIndex="-1" // So the modal is focusable
			>
				<div className={styles.modalHeader}>
					<h2 id="modal-title" className={styles.modalTitle}>
						{title}
					</h2>
					<button
						ref={closeButtonRef}
						className={styles.closeButton}
						onClick={onClose}
						aria-label="Close modal"
					>
						<X size={20} />
					</button>
				</div>
				<div className={styles.modalContent}>{children}</div>

				<div className={styles.modalGlow}></div>
			</div>
		</div>
	);
};

export default Modal;
