import api from "./api";

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// =====================================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// =====================================================

export const changePassword = async ({
  current_password,
  new_password,
}) => {
  const response = await api.put(
    "/users/change-password",
    {
      current_password,
      new_password,
    }
  );

  return response.data;
};