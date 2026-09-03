import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  name = "password",
  placeholder = "Enter password",
  required = true,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <LockKeyhole size={18} className="input-icon" />

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="current-password"
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword((previous) => !previous)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;