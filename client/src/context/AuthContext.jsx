import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
};

const getRole = (user) => {
  return user?.role?.toUpperCase() || null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(getStoredUser);

  const isAuthenticated = Boolean(token);

  const role = getRole(user);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (response) => {
    const receivedToken = response?.token;
    const receivedUser = response?.user;

    if (!receivedToken) {
      throw new Error(
        "JWT token was not returned by the server."
      );
    }

    if (!receivedUser) {
      throw new Error(
        "User information was not returned by the server."
      );
    }

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hasRole = (requiredRole) => {
    return role === requiredRole.toUpperCase();
  };

  const hasAnyRole = (allowedRoles) => {
    return allowedRoles.some(
      (allowedRole) =>
        role === allowedRole.toUpperCase()
    );
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;