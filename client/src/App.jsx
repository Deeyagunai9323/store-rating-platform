import { motion } from "framer-motion";
import { Store, ShieldCheck, Star } from "lucide-react";

const App = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        className="fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "48px",
          textAlign: "center",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-card)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Store
          size={54}
          strokeWidth={1.5}
          style={{
            color: "var(--accent-primary)",
            margin: "0 auto 20px",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            marginBottom: "12px",
          }}
        >
          Store Rating Platform
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "17px",
            marginBottom: "32px",
          }}
        >
          Rate stores, discover great businesses, and manage your
          store experience.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <Feature icon={<Star size={18} />} text="Rate Stores" />
          <Feature
            icon={<ShieldCheck size={18} />}
            text="Secure Authentication"
          />
          <Feature icon={<Store size={18} />} text="Store Management" />
        </div>
      </motion.div>
    </main>
  );
};

const Feature = ({ icon, text }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ color: "var(--accent-primary)" }}>
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
};

export default App;