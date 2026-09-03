import { Inbox } from "lucide-react";

import "./AdminFeedback.css";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display here.",
  icon: Icon = Inbox,
  action = null,
}) => {
  return (
    <div className="admin-empty-state">
      <div className="empty-state-icon">
        <Icon size={36} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;