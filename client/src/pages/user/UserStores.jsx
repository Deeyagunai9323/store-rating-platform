import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Store,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import {
  getUserStores,
} from "../../services/store.service";

import {
  createRating,
  updateRating,
} from "../../services/rating.service";

import "./UserStores.css";


const UserStores = () => {

  const [stores, setStores] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [ratingLoading, setRatingLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchField, setSearchField] =
    useState("name");

  const [sort, setSort] =
    useState("name");

  const [order, setOrder] =
    useState("asc");


  // =====================================================
  // LOAD STORES
  // =====================================================

  const loadStores = async () => {

    try {

      setLoading(true);
      setError("");

      const params = {
        sort,
        order,
      };

      if (search.trim()) {
        params[searchField] =
          search.trim();
      }

      const response =
        await getUserStores(params);

      const list =
        response?.data ||
        response?.stores ||
        [];

      setStores(
        Array.isArray(list)
          ? list
          : []
      );

    } catch (err) {

      console.error(
        "Load stores error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load stores."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadStores();

  }, [sort, order]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {

    event.preventDefault();

    loadStores();

  };


  // =====================================================
  // SORT
  // =====================================================

  const handleSort = (field) => {

    if (sort === field) {

      setOrder(
        order === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSort(field);

      setOrder("asc");

    }

  };


  // =====================================================
  // RATE STORE
  // =====================================================

  const handleRating = async (
    store
  ) => {

    const value = Number(
      store.__rating
    );

    if (
      !value ||
      value < 1 ||
      value > 5
    ) {

      setError(
        "Please select a rating between 1 and 5."
      );

      return;

    }

    try {

      setRatingLoading(store.id);
      setError("");
      setSuccess("");

      if (
        store.user_rating !== null &&
        store.user_rating !== undefined
      ) {

        await updateRating(
          store.id,
          value
        );

        setSuccess(
          "Rating updated successfully."
        );

      } else {

        await createRating({
          store_id: store.id,
          rating: value,
        });

        setSuccess(
          "Rating submitted successfully."
        );

      }

      await loadStores();

    } catch (err) {

      console.error(
        "Rating error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to submit rating."
      );

    } finally {

      setRatingLoading(null);

    }

  };


  // =====================================================
  // RATING SELECT
  // =====================================================

  const handleRatingChange = (
    storeId,
    value
  ) => {

    setStores(
      (previous) =>
        previous.map((store) =>
          store.id === storeId
            ? {
                ...store,
                __rating: value,
              }
            : store
        )
    );

  };


  return (

    <div className="user-stores-page">

      {/* HEADER */}

      <div className="user-page-header">

        <div>

          <span className="page-eyebrow">
            STORERATE
          </span>

          <h1>
            Stores
          </h1>

          <p>
            Discover stores and share
            your ratings.
          </p>

        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadStores}
          aria-label="Refresh stores"
        >
          <RefreshCw size={18} />
        </button>

      </div>


      {/* ALERTS */}

      {error && (
        <div
          className="error-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="success-alert"
          role="status"
        >
          {success}
        </div>
      )}


      {/* SEARCH */}

      <div className="user-store-toolbar">

        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <select
            value={searchField}
            onChange={(event) =>
              setSearchField(
                event.target.value
              )
            }
          >

            <option value="name">
              Name
            </option>

            <option value="address">
              Address
            </option>

          </select>

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search stores..."
          />

          <button type="submit">
            Search
          </button>

        </form>

      </div>


      {/* CONTENT */}

      <div className="user-stores-card">

        {loading ? (

          <div className="user-loading">

            <LoaderCircle
              size={32}
              className="spin"
            />

            <p>
              Loading stores...
            </p>

          </div>

        ) : stores.length === 0 ? (

          <div className="user-empty">

            <Store size={42} />

            <h3>
              No stores found
            </h3>

            <p>
              Try another search.
            </p>

          </div>

        ) : (

          <div className="store-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("name")
                      }
                    >
                      Store

                      {sort === "name" &&
                        (
                          order === "asc"
                            ? <ArrowUp size={14} />
                            : <ArrowDown size={14} />
                        )}

                    </button>

                  </th>

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort(
                          "address"
                        )
                      }
                    >
                      Address

                      {sort === "address" &&
                        (
                          order === "asc"
                            ? <ArrowUp size={14} />
                            : <ArrowDown size={14} />
                        )}

                    </button>

                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Your Rating
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {stores.map((store) => {

                  const selectedRating =
                    store.__rating ??
                    store.user_rating ??
                    "";

                  return (

                    <tr key={store.id}>

                      <td>

                        <div className="store-title">

                          <div className="store-icon">
                            <Store size={18} />
                          </div>

                          <div>

                            <strong>
                              {store.name}
                            </strong>

                            <span>
                              Store #{store.id}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        {store.address || "—"}
                      </td>


                      <td>

                        <div className="rating-display">

                          <Star
                            size={17}
                            fill="currentColor"
                          />

                          <strong>
                            {
                              Number(
                                store.average_rating || 0
                              ).toFixed(2)
                            }
                          </strong>

                        </div>

                      </td>


                      <td>

                        <select
                          value={selectedRating}
                          onChange={(event) =>
                            handleRatingChange(
                              store.id,
                              event.target.value
                            )
                          }
                          className="rating-select"
                          disabled={
                            ratingLoading ===
                            store.id
                          }
                        >

                          <option value="">
                            Select
                          </option>

                          <option value="1">
                            1 - Poor
                          </option>

                          <option value="2">
                            2 - Fair
                          </option>

                          <option value="3">
                            3 - Good
                          </option>

                          <option value="4">
                            4 - Very Good
                          </option>

                          <option value="5">
                            5 - Excellent
                          </option>

                        </select>

                      </td>


                      <td>

                        <button
                          className="rate-button"
                          onClick={() =>
                            handleRating(
                              store
                            )
                          }
                          disabled={
                            ratingLoading ===
                            store.id ||
                            !selectedRating
                          }
                        >

                          {ratingLoading ===
                          store.id ? (

                            <LoaderCircle
                              size={16}
                              className="spin"
                            />

                          ) : (

                            <Star size={16} />

                          )}

                          {store.user_rating
                            ? "Update"
                            : "Rate"}

                        </button>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

};

export default UserStores;