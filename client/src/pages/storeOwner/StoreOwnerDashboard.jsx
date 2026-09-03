import {
  useEffect,
  useState,
} from "react";

import {
  Store,
  Star,
  Users,
  LoaderCircle,
  RefreshCw,
  Mail,
  MapPin,
} from "lucide-react";

import api from "../../services/api";

import "./StoreOwnerDashboard.css";


const StoreOwnerDashboard = () => {

  const [stores, setStores] =
    useState([]);

  const [ratingUsers, setRatingUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/store-owner/dashboard"
        );

      const data =
        response?.data?.data || {};

      setStores(
        Array.isArray(data.stores)
          ? data.stores
          : []
      );

      setRatingUsers(
        Array.isArray(
          data.rating_users
        )
          ? data.rating_users
          : []
      );

    } catch (err) {

      console.error(
        "Store owner dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadDashboard();

  }, []);


  const totalRatings =
    stores.reduce(
      (total, store) =>
        total +
        Number(
          store.total_ratings || 0
        ),
      0
    );


  const averageRating =
    stores.length > 0
      ? (
          stores.reduce(
            (total, store) =>
              total +
              Number(
                store.average_rating || 0
              ),
            0
          ) / stores.length
        ).toFixed(2)
      : "0.00";


  if (loading) {

    return (

      <div className="owner-loading">

        <LoaderCircle
          size={34}
          className="spin"
        />

        <p>
          Loading dashboard...
        </p>

      </div>

    );

  }


  return (

    <div className="owner-dashboard">

      <div className="owner-header">

        <div>

          <span className="page-eyebrow">
            STORE OWNER
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Monitor your stores and
            customer ratings.
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
        >
          <RefreshCw size={18} />
        </button>

      </div>


      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}


      {/* STATS */}

      <div className="owner-stats">

        <div className="owner-stat-card">

          <Store />

          <div>

            <span>
              Stores
            </span>

            <strong>
              {stores.length}
            </strong>

          </div>

        </div>


        <div className="owner-stat-card">

          <Star />

          <div>

            <span>
              Total Ratings
            </span>

            <strong>
              {totalRatings}
            </strong>

          </div>

        </div>


        <div className="owner-stat-card">

          <Star />

          <div>

            <span>
              Average Rating
            </span>

            <strong>
              {averageRating}
            </strong>

          </div>

        </div>


        <div className="owner-stat-card">

          <Users />

          <div>

            <span>
              Rating Users
            </span>

            <strong>
              {ratingUsers.length}
            </strong>

          </div>

        </div>

      </div>


      {/* STORES */}

      <section className="owner-section">

        <div className="owner-section-header">

          <div>

            <h2>
              My Stores
            </h2>

            <p>
              Stores assigned to your account.
            </p>

          </div>

        </div>


        {stores.length === 0 ? (

          <div className="owner-empty">

            <Store size={40} />

            <h3>
              No store assigned
            </h3>

            <p>
              An administrator has not
              assigned a store to you yet.
            </p>

          </div>

        ) : (

          <div className="owner-store-grid">

            {stores.map((store) => (

              <div
                className="owner-store-card"
                key={store.id}
              >

                <div className="owner-store-top">

                  <div className="owner-store-icon">
                    <Store size={21} />
                  </div>

                  <div>

                    <h3>
                      {store.name}
                    </h3>

                    <span>
                      Store #{store.id}
                    </span>

                  </div>

                </div>


                <div className="owner-store-info">

                  <div>
                    <Mail size={15} />
                    {store.email}
                  </div>

                  <div>
                    <MapPin size={15} />
                    {store.address}
                  </div>

                </div>


                <div className="owner-rating-box">

                  <Star
                    size={20}
                    fill="currentColor"
                  />

                  <div>

                    <span>
                      Average Rating
                    </span>

                    <strong>
                      {Number(
                        store.average_rating || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Ratings
                    </span>

                    <strong>
                      {store.total_ratings || 0}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* USERS */}

      <section className="owner-section">

        <div className="owner-section-header">

          <div>

            <h2>
              Customer Ratings
            </h2>

            <p>
              Users who submitted ratings
              for your stores.
            </p>

          </div>

        </div>


        {ratingUsers.length === 0 ? (

          <div className="owner-empty">

            <Users size={40} />

            <h3>
              No ratings yet
            </h3>

            <p>
              Customer rating activity
              will appear here.
            </p>

          </div>

        ) : (

          <div className="owner-rating-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Store
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {ratingUsers.map(
                  (item, index) => (

                    <tr
                      key={`${item.user_id}-${item.store_id}-${index}`}
                    >

                      <td>

                        <div className="rating-user">

                          <div className="rating-user-avatar">
                            {item.user_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {item.user_name}
                            </strong>

                            <span>
                              {item.user_email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {item.store_name}
                      </td>

                      <td>

                        <span className="owner-rating-value">

                          <Star
                            size={15}
                            fill="currentColor"
                          />

                          {item.rating}

                        </span>

                      </td>

                      <td>

                        {item.created_at
                          ? new Date(
                              item.created_at
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

      </section>

    </div>

  );

};

export default StoreOwnerDashboard;