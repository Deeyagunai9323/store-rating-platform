import api from "./api";

// =====================================================
// GET ADMIN STORES
// =====================================================

export const getAdminStores = async (params = {}) => {
  const response = await api.get("/admin/stores", {
    params,
  });

  return response.data;
};


// =====================================================
// CREATE STORE
// =====================================================

export const createAdminStore = async (storeData) => {
  const response = await api.post(
    "/admin/stores",
    storeData
  );

  return response.data;
};


// =====================================================
// GET STORE DETAILS
// =====================================================

export const getAdminStoreById = async (storeId) => {
  const response = await api.get(
    `/admin/stores/${storeId}`
  );

  return response.data;
};