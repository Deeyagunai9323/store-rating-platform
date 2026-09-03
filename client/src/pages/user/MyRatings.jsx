import {
  useEffect,
  useState,
} from "react";

import {
  Star,
  Store,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  getUserStores,
} from "../../services/store.service";

import {
  updateRating,
} from "../../services/rating.service";

import "./MyRatings.css";


const MyRatings = () => {

  const [ratings, setRatings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const loadRatings = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getUserStores();

      const stores =
        response?.data || [];

      const myRatings =
        stores.filter(
          (store) =>
            store.user_rating !== null &&
            store.user_rating !== undefined
        );

      setRatings(myRatings);

    } catch (err) {

      console.error(
        "Load ratings error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load your ratings."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadRatings();

  }, []);


  const handleUpdate = async (
    storeId,
    rating
  ) => {

    try {

      setUpdating(storeId);
      setError("");
      setSuccess("");

      await updateRating(
        storeId,
        Number(rating)
      );

      setSuccess(
        "Rating updated successfully."
      );

      await loadRatings();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to update rating."
      );

    } finally {

      setUpdating(null);

    }

  };


  return (

    <div className="my-ratings-page">

      <div className="user-page-header">

        <div>

          <span className="page-eyebrow">
            STORERATE
          </span>

          <h1>
            My Ratings
          </h1>

          <p>
            View and update the ratings
            you have submitted.
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadRatings}
          aria-label="Refresh ratings"
        >
          <RefreshCw size={18} />
        </button>

      </div>


      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}


      {success && (
        <div className="success-alert">
          {success}
        </div>
      )}


      {loading ? (

        <div className="ratings-loading">

          <LoaderCircle
            size={30}
            className="spin"
          />

          <p>
            Loading ratings...
          </p>

        </div>

      ) : ratings.length === 0 ? (

        <div className="ratings-empty">

          <Star size={42} />

          <h3>
            No ratings yet
          </h3>

          <p>
            Visit Stores and rate a store.
          </p>

        </div>

      ) : (

        <div className="ratings-list">

          {ratings.map((store) => (

            <div
              className="rating-card"
              key={store.id}
            >

              <div className="rating-store-icon">
                <Store size={21} />
              </div>

              <div className="rating-store-info">

                <h3>
                  {store.name}
                </h3>

                <p>
                  {store.address}
                </p>

              </div>

              <div className="rating-current">

                <Star
                  size={17}
                  fill="currentColor"
                />

                <strong>
                  {store.user_rating}
                </strong>

              </div>

              <select
                value={store.user_rating}
                disabled={
                  updating === store.id
                }
                onChange={(event) =>
                  handleUpdate(
                    store.id,
                    event.target.value
                  )
                }
              >

                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3">
                  3
                </option>

                <option value="4">
                  4
                </option>

                <option value="5">
                  5
                </option>

              </select>

              {updating === store.id && (
                <LoaderCircle
                  size={18}
                  className="spin"
                />
              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default MyRatings;