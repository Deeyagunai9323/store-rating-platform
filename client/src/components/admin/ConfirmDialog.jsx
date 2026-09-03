import {
  AlertTriangle,
  X,
} from "lucide-react";

import "./AdminFeedback.css";

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) => {
  if (!open) {
    return null;
  }

  const handleOverlayClick = () => {
    if (!loading && onCancel) {
      onCancel();
    }
  };

  return (
    <div
      className="confirm-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="confirm-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close confirmation dialog"
        >
          <X size={20} />
        </button>

        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>

        <h2 id="confirm-dialog-title">
          {title}
        </h2>

        <p id="confirm-dialog-message">
          {message}
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              danger
                ? "confirm-danger"
                : "confirm-primary"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;