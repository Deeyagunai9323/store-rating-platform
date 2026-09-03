import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <ShieldAlert
          size={64}
          style={{
            color: "var(--accent-primary)",
            marginBottom: "20px",
          }}
        />

        <h1>Access Denied</h1>

        <p
          style={{
            color: "var(--text-secondary)",
            margin: "12px 0 24px",
          }}
        >
          You don't have permission to access this
          page.
        </p>

        <Link
          to="/"
          style={{
            color: "var(--accent-primary)",
          }}
        >
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;