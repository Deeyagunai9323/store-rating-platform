import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

import "./AdminFeedback.css";

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    className: "toast-success",
  },

  error: {
    icon: AlertCircle,
    className: "toast-error",
  },

  info: {
    icon: Info,
    className: "toast-info",
  },
};

const Toast = ({
  message,
  type = "success",
  onClose,
}) => {
  if (!message) {
    return null;
  }

  const config =
    TOAST_CONFIG[type] ||
    TOAST_CONFIG.info;

  const Icon = config.icon;

  return (
    <div
      className={`admin-toast ${config.className}`}
      role="status"
      aria-live="polite"
    >
      <Icon
        size={20}
        aria-hidden="true"
      />

      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
};

export default Toast;