import { AlertCircle, X } from "lucide-react";

import "./AdminFeedback.css";

const ErrorAlert = ({
  message = "Something went wrong.",
  onClose,
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="admin-error-alert"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle
        size={20}
        aria-hidden="true"
      />

      <div className="error-alert-content">
        <strong>Error</strong>

        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          className="error-alert-close"
          onClick={onClose}
          aria-label="Close error message"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;