import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Store,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  LoaderCircle,
  RefreshCw,
  UserRound,
  Star,
} from "lucide-react";

import {
  getAdminStores,
  createAdminStore,
} from "../../services/store.service";

import {
  getAdminUsers,
} from "../../services/admin.service";

import "./AdminStores.css";


const EMPTY_FORM = {
  name: "",
  email: "",
  address: "",
  owner_id: "",
};


const AdminStores = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [stores, setStores] = useState([]);

  const [owners, setOwners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [ownersLoading, setOwnersLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("name");

  const [order, setOrder] = useState("ASC");

  const [showModal, setShowModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedStore, setSelectedStore] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);


  // =====================================================
  // OWNER LOOKUP
  // owner_id -> owner object
  // =====================================================

  const ownerMap = useMemo(() => {

    const map = {};

    owners.forEach((owner) => {

      if (owner?.id) {
        map[String(owner.id)] = owner;
      }

    });

    return map;

  }, [owners]);


  // =====================================================
  // GET OWNER NAME
  // =====================================================

  const getOwnerName = (store) => {

    // Backend may already return owner_name
    if (store?.owner_name) {
      return store.owner_name;
    }

    if (store?.ownerName) {
      return store.ownerName;
    }

    // Get owner ID from backend response
    const ownerId =
      store?.owner_id ??
      store?.ownerId ??
      store?.owner?.id;

    if (ownerId) {

      const owner =
        ownerMap[String(ownerId)];

      if (owner) {

        return (
          owner.name ||
          owner.full_name ||
          owner.email ||
          `Owner #${ownerId}`
        );

      }

      return `Owner #${ownerId}`;

    }

    // If backend sends owner object
    if (
      store?.owner &&
      typeof store.owner === "object"
    ) {

      return (
        store.owner.name ||
        store.owner.full_name ||
        store.owner.email ||
        "Unassigned"
      );

    }

    return "Unassigned";
  };


  // =====================================================
  // GET OWNER ID
  // =====================================================

  const getOwnerId = (store) => {

    return (
      store?.owner_id ??
      store?.ownerId ??
      store?.owner?.id ??
      null
    );

  };


  // =====================================================
  // GET RATING
  // =====================================================

  const getRating = (store) => {

    const rating =
      store?.average_rating ??
      store?.rating;

    if (
      rating === null ||
      rating === undefined ||
      rating === ""
    ) {
      return "0.00";
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating)) {
      return rating;
    }

    return numericRating.toFixed(2);

  };


  // =====================================================
  // GET CREATED DATE
  // =====================================================

  const getCreatedDate = (store) => {

    if (!store?.created_at) {
      return "—";
    }

    const date = new Date(store.created_at);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString();

  };


  // =====================================================
  // LOAD STORE OWNERS
  // =====================================================

  const loadOwners = async () => {

    try {

      setOwnersLoading(true);

      const response = await getAdminUsers({
        role: "STORE_OWNER",
        sortBy: "name",
        order: "ASC",
      });

      console.log(
        "STORE OWNER API RESPONSE:",
        response
      );

      const userList =
        response?.data?.users ||
        response?.data ||
        response?.users ||
        [];

      setOwners(
        Array.isArray(userList)
          ? userList
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load store owners:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load store owners."
      );

    } finally {

      setOwnersLoading(false);

    }

  };


  // =====================================================
  // LOAD STORES
  // =====================================================

  const loadStores = async () => {

    try {

      setLoading(true);

      setError("");

      const params = {
        sortBy,
        order,
      };

      if (search.trim()) {

        params.name = search.trim();

      }

      console.log(
        "GET STORES PARAMS:",
        params
      );

      const response =
        await getAdminStores(params);

      console.log(
        "STORES API RESPONSE:",
        response
      );

      const storeList =
        response?.data?.stores ||
        response?.data ||
        response?.stores ||
        [];

      setStores(
        Array.isArray(storeList)
          ? storeList
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load stores:",
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


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadOwners();

  }, []);


  useEffect(() => {

    loadStores();

  }, [sortBy, order]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async (event) => {

    event.preventDefault();

    await loadStores();

  };


  // =====================================================
  // SORT
  // =====================================================

  const handleSort = (field) => {

    if (sortBy === field) {

      setOrder(
        order === "ASC"
          ? "DESC"
          : "ASC"
      );

    } else {

      setSortBy(field);

      setOrder("ASC");

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = async () => {

    setFormData(EMPTY_FORM);

    setError("");

    setSuccess("");

    setShowModal(true);

    // Refresh owners whenever modal opens
    await loadOwners();

  };


  // =====================================================
  // CREATE STORE
  // =====================================================

  const handleCreateStore = async (event) => {

    event.preventDefault();

    setCreating(true);

    setError("");

    setSuccess("");

    try {

      if (!formData.owner_id) {

        setError(
          "Please select a store owner."
        );

        return;

      }

      const payload = {

        name: formData.name.trim(),

        email: formData.email.trim(),

        address: formData.address.trim(),

        owner_id: Number(
          formData.owner_id
        ),

      };

      console.log(
        "CREATE STORE PAYLOAD:",
        payload
      );

      await createAdminStore(payload);

      setSuccess(
        "Store created successfully."
      );

      setFormData(EMPTY_FORM);

      setShowModal(false);

      // Reload stores
      await loadStores();

    } catch (err) {

      console.error(
        "Create store error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to create store."
      );

    } finally {

      setCreating(false);

    }

  };


  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (store) => {

    setSelectedStore(store);

    setShowDetails(true);

  };


  // =====================================================
  // SORT ICON
  // =====================================================

  const SortIcon = ({ field }) => {

    if (sortBy !== field) {
      return null;
    }

    return order === "ASC"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />;

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-stores-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>

          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>
            Store Management
          </h1>

          <p>
            Create, search and manage
            StoreRate stores.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openCreateModal}
        >

          <Plus size={18} />

          Add Store

        </button>

      </div>


      {/* =================================================
          ALERTS
      ================================================= */}

      {success && (

        <div className="success-alert">

          {success}

        </div>

      )}


      {error && (

        <div className="error-alert">

          {error}

        </div>

      )}


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="stores-toolbar">

        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search stores..."
          />

          <button type="submit">
            Search
          </button>

        </form>


        <button
          className="refresh-button"
          onClick={loadStores}
          title="Refresh stores"
        >

          <RefreshCw size={18} />

        </button>

      </div>


      {/* =================================================
          STORE TABLE
      ================================================= */}

      <div className="stores-card">

        {loading ? (

          <div className="table-loading">

            <LoaderCircle
              size={30}
              className="spin"
            />

            <p>
              Loading stores...
            </p>

          </div>

        ) : stores.length === 0 ? (

          <div className="empty-state">

            <Store size={40} />

            <h3>
              No stores found
            </h3>

            <p>
              Try changing your search
              or add a new store.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  {/* STORE NAME */}

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("name")
                      }
                    >

                      Store Name

                      <SortIcon field="name" />

                    </button>

                  </th>


                  {/* EMAIL */}

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("email")
                      }
                    >

                      Email

                      <SortIcon field="email" />

                    </button>

                  </th>


                  {/* ADDRESS */}

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("address")
                      }
                    >

                      Address

                      <SortIcon field="address" />

                    </button>

                  </th>


                  {/* OWNER */}

                  <th>
                    Owner
                  </th>


                  {/* RATING */}

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("rating")
                      }
                    >

                      Rating

                      <SortIcon field="rating" />

                    </button>

                  </th>


                  {/* CREATED */}

                  <th>

                    <button
                      className="sort-button"
                      onClick={() =>
                        handleSort("created_at")
                      }
                    >

                      Created

                      <SortIcon field="created_at" />

                    </button>

                  </th>


                  {/* ACTION */}

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {stores.map((store) => {

                  const ownerId =
                    getOwnerId(store);

                  const ownerName =
                    getOwnerName(store);

                  return (

                    <tr
                      key={store.id}
                    >

                      {/* STORE NAME */}

                      <td>

                        <div className="store-name-cell">

                          <div className="store-avatar">

                            <Store
                              size={17}
                            />

                          </div>

                          <span>
                            {store.name}
                          </span>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>
                        {store.email}
                      </td>


                      {/* ADDRESS */}

                      <td>

                        <span className="address-cell">

                          {store.address ||
                            "—"}

                        </span>

                      </td>


                      {/* OWNER */}

                      <td>

                        <div className="owner-cell">

                          <UserRound
                            size={16}
                          />

                          <div>

                            <span>
                              {ownerName}
                            </span>

                            {ownerId && (
                              <small
                                style={{
                                  display:
                                    "block",
                                  opacity:
                                    0.6,
                                }}
                              >
                                #{ownerId}
                              </small>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* RATING */}

                      <td>

                        <div className="rating-cell">

                          <Star
                            size={16}
                          />

                          <span>
                            {getRating(store)}
                          </span>

                        </div>

                      </td>


                      {/* CREATED */}

                      <td>

                        {getCreatedDate(
                          store
                        )}

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="icon-action"
                          onClick={() =>
                            handleViewDetails(
                              store
                            )
                          }
                          title="View store details"
                        >

                          <Eye size={17} />

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


      {/* =================================================
          CREATE STORE MODAL
      ================================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={() =>
            !creating &&
            setShowModal(false)
          }
        >

          <div
            className="modal-card"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="page-eyebrow">
                  STORE MANAGEMENT
                </span>

                <h2>
                  Add Store
                </h2>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  !creating &&
                  setShowModal(false)
                }
              >

                <X size={20} />

              </button>

            </div>


            <form
              className="admin-store-form"
              onSubmit={handleCreateStore}
            >

              {/* STORE NAME */}

              <div className="form-field">

                <label htmlFor="store-name">
                  Store Name
                </label>

                <input
                  id="store-name"
                  name="name"
                  value={formData.name}
                  onChange={
                    handleFormChange
                  }
                  maxLength={100}
                  required
                  disabled={creating}
                  placeholder="Enter store name"
                />

              </div>


              {/* EMAIL */}

              <div className="form-field">

                <label htmlFor="store-email">
                  Store Email
                </label>

                <input
                  id="store-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={
                    handleFormChange
                  }
                  required
                  disabled={creating}
                  placeholder="store@example.com"
                />

              </div>


              {/* ADDRESS */}

              <div className="form-field">

                <label htmlFor="store-address">
                  Address
                </label>

                <textarea
                  id="store-address"
                  name="address"
                  value={formData.address}
                  onChange={
                    handleFormChange
                  }
                  maxLength={400}
                  rows={4}
                  required
                  disabled={creating}
                  placeholder="Enter store address"
                />

              </div>


              {/* STORE OWNER */}

              <div className="form-field">

                <label htmlFor="owner_id">
                  Store Owner
                </label>

                <select
                  id="owner_id"
                  name="owner_id"
                  value={
                    formData.owner_id
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                  disabled={
                    creating ||
                    ownersLoading
                  }
                >

                  <option value="">

                    {ownersLoading
                      ? "Loading owners..."
                      : "Select store owner"}

                  </option>


                  {owners.map(
                    (owner) => (

                      <option
                        key={owner.id}
                        value={owner.id}
                      >

                        {owner.name}

                        {" — "}

                        {owner.email}

                      </option>

                    )
                  )}

                </select>


                {!ownersLoading &&
                  owners.length === 0 && (

                    <small>

                      No STORE_OWNER users
                      are available.

                    </small>

                  )}

              </div>


              {/* CREATE BUTTON */}

              <button
                type="submit"
                className="primary-button modal-submit"
                disabled={
                  creating ||
                  !formData.owner_id
                }
              >

                {creating ? (

                  <>

                    <LoaderCircle
                      size={18}
                      className="spin"
                    />

                    Creating...

                  </>

                ) : (

                  <>

                    <Plus size={18} />

                    Create Store

                  </>

                )}

              </button>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          STORE DETAILS MODAL
      ================================================= */}

      {showDetails &&
        selectedStore && (

          <div
            className="modal-overlay"
            onMouseDown={() =>
              setShowDetails(false)
            }
          >

            <div
              className="modal-card details-modal"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>

                  <span className="page-eyebrow">
                    STORE DETAILS
                  </span>

                  <h2>
                    {selectedStore.name}
                  </h2>

                </div>


                <button
                  className="modal-close"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >

                  <X size={20} />

                </button>

              </div>


              <div className="details-content">

                <div className="details-avatar">

                  <Store size={26} />

                </div>


                <div className="details-grid">

                  <div>

                    <span>
                      Store ID
                    </span>

                    <strong>
                      #{selectedStore.id}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Store Name
                    </span>

                    <strong>
                      {selectedStore.name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedStore.email}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Address
                    </span>

                    <strong>
                      {selectedStore.address ||
                        "—"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Owner
                    </span>

                    <strong>

                      {getOwnerName(
                        selectedStore
                      )}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Owner ID
                    </span>

                    <strong>

                      {getOwnerId(
                        selectedStore
                      )
                        ? `#${getOwnerId(
                            selectedStore
                          )}`
                        : "—"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Rating
                    </span>

                    <strong>

                      {getRating(
                        selectedStore
                      )}

                    </strong>

                  </div>


                  {selectedStore.created_at && (

                    <div>

                      <span>
                        Created
                      </span>

                      <strong>

                        {new Date(
                          selectedStore.created_at
                        ).toLocaleString()}

                      </strong>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

    </div>

  );

};


export default AdminStores;