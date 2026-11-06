import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className="modal-top">
        <span className="eyebrow">NEKO YORU / {title}</span>

        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={22} />
        </button>
      </div>

      {children}
    </dialog>
  );
}
