import {
  useEffect,
  useState,
} from "react";

import {
  Star,
  LoaderCircle,
} from "lucide-react";

import api from "../../services/api";


const StoreOwnerRatings = () => {

  const [ratings, setRatings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadRatings = async () => {

      try {

        const response =
          await api.get(
            "/store-owner/dashboard"
          );

        setRatings(
          response?.data?.data
            ?.rating_users || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Unable to load ratings."
        );

      } finally {

        setLoading(false);

      }

    };

    loadRatings();

  }, []);


  return (

    <div>

      <div className="owner-header">

        <div>

          <span className="page-eyebrow">
            STORE OWNER
          </span>

          <h1>
            Ratings
          </h1>

          <p>
            Customer ratings for your stores.
          </p>

        </div>

      </div>


      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}


      {loading ? (

        <div className="owner-loading">

          <LoaderCircle
            size={30}
            className="spin"
          />

          <p>
            Loading ratings...
          </p>

        </div>

      ) : ratings.length === 0 ? (

        <div className="owner-empty">

          <Star size={40} />

          <h3>
            No ratings yet
          </h3>

          <p>
            Ratings from customers will
            appear here.
          </p>

        </div>

      ) : (

        <div className="owner-rating-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Customer
                </th>

                <th>
                  Store
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Submitted
                </th>

              </tr>

            </thead>

            <tbody>

              {ratings.map(
                (rating, index) => (

                  <tr
                    key={`${rating.user_id}-${rating.store_id}-${index}`}
                  >

                    <td>
                      {rating.user_name}
                    </td>

                    <td>
                      {rating.store_name}
                    </td>

                    <td>

                      <span className="owner-rating-value">

                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        {rating.rating}

                      </span>

                    </td>

                    <td>
                      {rating.created_at
                        ? new Date(
                            rating.created_at
                          ).toLocaleString()
                        : "—"}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default StoreOwnerRatings;