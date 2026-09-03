import api from "./api";

// =====================================================
// CREATE RATING
// POST /api/ratings
// =====================================================

export const createRating = async ({
  store_id,
  rating,
}) => {
  const response = await api.post("/ratings", {
    store_id,
    rating,
  });

  return response.data;
};

// =====================================================
// UPDATE RATING
// PUT /api/ratings/:storeId
// =====================================================

export const updateRating = async (
  storeId,
  rating
) => {
  const response = await api.put(
    `/ratings/${storeId}`,
    {
      rating,
    }
  );

  return response.data;
};