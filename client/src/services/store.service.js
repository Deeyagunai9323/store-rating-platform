import api from "./api";

// =====================================================
// ADMIN - GET STORES
// =====================================================

export const getAdminStores = async (params = {}) => {
  const response = await api.get("/admin/stores", {
    params,
  });

  return response.data;
};

// =====================================================
// ADMIN - CREATE STORE
// =====================================================

export const createAdminStore = async (storeData) => {
  const response = await api.post(
    "/admin/stores",
    storeData
  );

  return response.data;
};

// =====================================================
// NORMAL USER - GET STORES
// Backend:
// GET /api/stores
//
// Supports:
// name
// address
// sort=name/address/rating
// order=asc/desc
//
// Response contains:
// average_rating
// user_rating
// =====================================================

export const getUserStores = async (params = {}) => {
  const response = await api.get("/stores", {
    params,
  });

  return response.data;
};