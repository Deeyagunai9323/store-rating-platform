import api from "./api";

// =====================================================
// CREATE USER / ADMIN / STORE OWNER
// =====================================================

export const createAdminUser = async (userData) => {
  const response = await api.post(
    "/admin/users",
    userData
  );

  return response.data;
};


// =====================================================
// GET USERS
// =====================================================

export const getAdminUsers = async (params = {}) => {
  const response = await api.get(
    "/admin/users",
    {
      params,
    }
  );

  return response.data;
};


// =====================================================
// GET USER DETAILS
// =====================================================

export const getAdminUserById = async (userId) => {
  const response = await api.get(
    `/admin/users/${userId}`
  );

  return response.data;
};