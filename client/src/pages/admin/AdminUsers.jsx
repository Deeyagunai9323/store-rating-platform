import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  Store,
  UserRound,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  LoaderCircle,
  RefreshCw,
  Mail,
  MapPin,
} from "lucide-react";

import {
  createAdminUser,
  getAdminUsers,
  getAdminUserById,
} from "../../services/admin.service";

import "./AdminUsers.css";


// =====================================================
// ROLE OPTIONS
// IMPORTANT:
// Backend expects "role", NOT "role_id"
// =====================================================

const ROLE_OPTIONS = [
  {
    value: "USER",
    label: "Normal User",
    icon: UserRound,
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
  },
  {
    value: "STORE_OWNER",
    label: "Store Owner",
    icon: Store,
  },
];


// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  address: "",
  role: "USER",
};


// =====================================================
// SEARCH TYPES
// =====================================================

const SEARCH_OPTIONS = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "address",
    label: "Address",
  },
];


// =====================================================
// COMPONENT
// =====================================================

const AdminUsers = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [searchField, setSearchField] = useState("name");

  const [roleFilter, setRoleFilter] = useState("");

  const [sortBy, setSortBy] = useState("name");

  const [sortOrder, setSortOrder] = useState("ASC");

  const [showModal, setShowModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState(
    EMPTY_FORM
  );


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);

      setError("");

      const params = {
        sortBy,
        order: sortOrder,
      };


      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      if (search.trim()) {

        params[searchField] =
          search.trim();

      }


      // -----------------------------------------------
      // ROLE FILTER
      // -----------------------------------------------

      if (roleFilter) {

        params.role = roleFilter;

      }


      console.log(
        "Admin users request params:",
        params
      );


      const response =
        await getAdminUsers(params);


      console.log(
        "Admin users response:",
        response
      );


      // -----------------------------------------------
      // HANDLE POSSIBLE RESPONSE STRUCTURES
      // -----------------------------------------------

      const userList =
        response?.data?.users ||
        response?.data ||
        response?.users ||
        [];


      setUsers(
        Array.isArray(userList)
          ? userList
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load admin users:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors;


      if (Array.isArray(backendMessage)) {

        setError(
          backendMessage
            .map(
              (item) =>
                item.msg ||
                item.message ||
                String(item)
            )
            .join(", ")
        );

      } else {

        setError(
          backendMessage ||
          "Unable to load users."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD + FILTER/SORT CHANGE
  // =====================================================

  useEffect(() => {

    loadUsers();

  }, [
    roleFilter,
    sortBy,
    sortOrder,
  ]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {

    event.preventDefault();

    loadUsers();

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {

    setSearch("");

    setTimeout(() => {
      loadUsers();
    }, 0);

  };


  // =====================================================
  // SORT
  // =====================================================

  const handleSort = (field) => {

    if (sortBy === field) {

      setSortOrder(
        sortOrder === "ASC"
          ? "DESC"
          : "ASC"
      );

    } else {

      setSortBy(field);

      setSortOrder("ASC");

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


    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }

  };


  // =====================================================
  // ROLE CHANGE
  // =====================================================

  const handleRoleChange = (event) => {

    setFormData((previous) => ({
      ...previous,
      role: event.target.value,
    }));

  };


  // =====================================================
  // CREATE USER
  // =====================================================

  const handleCreateUser = async (event) => {

    event.preventDefault();

    setCreating(true);

    setError("");

    setSuccess("");


    try {

      // IMPORTANT:
      // Backend expects:
      //
      // {
      //   name,
      //   email,
      //   password,
      //   address,
      //   role
      // }
      //
      // NOT role_id

      const payload = {

        name: formData.name.trim(),

        email: formData.email.trim(),

        password: formData.password,

        address: formData.address.trim(),

        role: formData.role,

      };


      console.log(
        "Create user payload:",
        payload
      );


      await createAdminUser(payload);


      setSuccess(
        "User created successfully."
      );


      setFormData({
        ...EMPTY_FORM,
      });


      setShowModal(false);


      // Refresh user list
      await loadUsers();


    } catch (err) {

      console.error(
        "Create user error:",
        err
      );


      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors;


      if (Array.isArray(backendMessage)) {

        setError(
          backendMessage
            .map(
              (item) =>
                item.msg ||
                item.message ||
                String(item)
            )
            .join(", ")
        );

      } else {

        setError(
          backendMessage ||
          "Unable to create user."
        );

      }

    } finally {

      setCreating(false);

    }

  };


  // =====================================================
  // VIEW USER DETAILS
  // =====================================================

  const handleViewDetails = async (userId) => {

    try {

      setDetailsLoading(true);

      setShowDetails(true);

      setSelectedUser(null);


      const response =
        await getAdminUserById(userId);


      console.log(
        "User details response:",
        response
      );


      const user =
        response?.data?.user ||
        response?.data ||
        response?.user;


      setSelectedUser(user);

    } catch (err) {

      console.error(
        "User details error:",
        err
      );


      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load user details."
      );


      setShowDetails(false);

    } finally {

      setDetailsLoading(false);

    }

  };


  // =====================================================
  // ROLE NAME
  // =====================================================

  const getRoleName = (user) => {

    return (
      user?.role ||
      user?.role_name ||
      user?.roleName ||
      "UNKNOWN"
    );

  };


  // =====================================================
  // ROLE BADGE
  // =====================================================

  const RoleBadge = ({ user }) => {

    const role = getRoleName(user);


    return (

      <span
        className={`role-badge role-${role
          .toLowerCase()
          .replace("_", "-")}`}
      >

        {role.replace("_", " ")}

      </span>

    );

  };


  // =====================================================
  // CLOSE CREATE MODAL
  // =====================================================

  const closeCreateModal = () => {

    if (creating) {
      return;
    }


    setShowModal(false);

    setFormData({
      ...EMPTY_FORM,
    });

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="admin-users-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>

          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>
            User Management
          </h1>

          <p>
            Create, search and manage
            StoreRate users.
          </p>

        </div>


        <button
          className="primary-button"
          type="button"
          onClick={() => {

            setFormData({
              ...EMPTY_FORM,
            });

            setError("");

            setSuccess("");

            setShowModal(true);

          }}
        >

          <Plus size={18} />

          Add User

        </button>

      </div>



      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div
          className="success-alert"
          role="status"
        >

          {success}

        </div>

      )}



      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          className="error-alert"
          role="alert"
        >

          {error}

        </div>

      )}



      {/* =================================================
          SEARCH / FILTER TOOLBAR
      ================================================= */}

      <div className="users-toolbar">


        {/* SEARCH FORM */}

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
            className="search-type-select"
            aria-label="Search field"
          >

            {SEARCH_OPTIONS.map(
              (option) => (

                <option
                  key={option.value}
                  value={option.value}
                >

                  {option.label}

                </option>

              )
            )}

          </select>


          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={
              searchField === "name"
                ? "Search by name..."
                : searchField === "email"
                ? "Search by email..."
                : "Search by address..."
            }
            aria-label="Search users"
          />


          {search && (

            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              title="Clear search"
            >

              <X size={16} />

            </button>

          )}


          <button
            type="submit"
            className="search-button"
          >

            Search

          </button>

        </form>



        {/* ROLE FILTER */}

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(
              event.target.value
            )
          }
          className="filter-select"
          aria-label="Filter by role"
        >

          <option value="">
            All Roles
          </option>

          <option value="USER">
            Normal User
          </option>

          <option value="ADMIN">
            Admin
          </option>

          <option value="STORE_OWNER">
            Store Owner
          </option>

        </select>



        {/* REFRESH */}

        <button
          type="button"
          className="refresh-button"
          onClick={loadUsers}
          title="Refresh users"
          aria-label="Refresh users"
        >

          <RefreshCw size={18} />

        </button>

      </div>



      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div className="users-card">


        {loading ? (

          <div className="table-loading">

            <LoaderCircle
              size={30}
              className="spin"
            />

            <p>
              Loading users...
            </p>

          </div>

        ) : users.length === 0 ? (

          <div className="empty-state">

            <Users size={40} />

            <h3>
              No users found
            </h3>

            <p>
              Try changing your search
              or filters.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>

                    <button
                      type="button"
                      className="sort-button"
                      onClick={() =>
                        handleSort("name")
                      }
                    >

                      Name

                      {sortBy === "name" &&
                        (
                          sortOrder === "ASC"
                            ? (
                              <ArrowUp
                                size={14}
                              />
                            )
                            : (
                              <ArrowDown
                                size={14}
                              />
                            )
                        )}

                    </button>

                  </th>


                  <th>

                    <button
                      type="button"
                      className="sort-button"
                      onClick={() =>
                        handleSort("email")
                      }
                    >

                      Email

                      {sortBy === "email" &&
                        (
                          sortOrder === "ASC"
                            ? (
                              <ArrowUp
                                size={14}
                              />
                            )
                            : (
                              <ArrowDown
                                size={14}
                              />
                            )
                        )}

                    </button>

                  </th>


                  <th>
                    Address
                  </th>


                  <th>
                    Role
                  </th>


                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                  >


                    {/* NAME */}

                    <td>

                      <div className="user-name-cell">

                        <div className="user-avatar">

                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <span>
                          {user.name}
                        </span>

                      </div>

                    </td>



                    {/* EMAIL */}

                    <td>

                      <div className="table-contact">

                        <Mail size={14} />

                        {user.email}

                      </div>

                    </td>



                    {/* ADDRESS */}

                    <td>

                      <div className="table-contact">

                        <MapPin size={14} />

                        <span className="address-cell">

                          {user.address ||
                            "—"}

                        </span>

                      </div>

                    </td>



                    {/* ROLE */}

                    <td>

                      <RoleBadge
                        user={user}
                      />

                    </td>



                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className="icon-action"
                        onClick={() =>
                          handleViewDetails(
                            user.id
                          )
                        }
                        title="View details"
                        aria-label={`View details for ${user.name}`}
                      >

                        <Eye size={17} />

                      </button>

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>



      {/* =================================================
          CREATE USER MODAL
      ================================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={closeCreateModal}
        >

          <div
            className="modal-card"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="page-eyebrow">
                  USER MANAGEMENT
                </span>

                <h2>
                  Add User
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeCreateModal}
                disabled={creating}
                aria-label="Close"
              >

                <X size={20} />

              </button>

            </div>



            {/* CREATE FORM */}

            <form
              onSubmit={handleCreateUser}
              className="admin-user-form"
            >


              {/* NAME */}

              <div className="form-field">

                <label htmlFor="user-name">
                  Name
                </label>

                <input
                  id="user-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  minLength={20}
                  maxLength={60}
                  required
                  disabled={creating}
                  placeholder="Enter full name"
                />

                <small>
                  20–60 characters
                </small>

              </div>



              {/* EMAIL */}

              <div className="form-field">

                <label htmlFor="user-email">
                  Email
                </label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  disabled={creating}
                  placeholder="user@example.com"
                />

              </div>



              {/* PASSWORD */}

              <div className="form-field">

                <label htmlFor="user-password">
                  Password
                </label>

                <input
                  id="user-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  minLength={8}
                  maxLength={16}
                  required
                  disabled={creating}
                  placeholder="Enter password"
                />

                <small>
                  8–16 characters, one uppercase
                  and one special character.
                </small>

              </div>



              {/* ADDRESS */}

              <div className="form-field">

                <label htmlFor="user-address">
                  Address
                </label>

                <textarea
                  id="user-address"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  maxLength={400}
                  required
                  disabled={creating}
                  placeholder="Enter address"
                  rows={4}
                />

                <small>
                  Maximum 400 characters
                </small>

              </div>



              {/* ROLE */}

              <div className="form-field">

                <label htmlFor="user-role">
                  Role
                </label>

                <select
                  id="user-role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  disabled={creating}
                >

                  {ROLE_OPTIONS.map(
                    (role) => (

                      <option
                        key={role.value}
                        value={role.value}
                      >

                        {role.label}

                      </option>

                    )
                  )}

                </select>

              </div>



              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button modal-submit"
                disabled={creating}
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

                    Create User

                  </>

                )}

              </button>

            </form>

          </div>

        </div>

      )}



      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {showDetails && (

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


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <span className="page-eyebrow">
                  USER DETAILS
                </span>

                <h2>
                  Account Information
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowDetails(false)
                }
                aria-label="Close details"
              >

                <X size={20} />

              </button>

            </div>



            {/* LOADING */}

            {detailsLoading ? (

              <div className="table-loading">

                <LoaderCircle
                  size={30}
                  className="spin"
                />

                <p>
                  Loading details...
                </p>

              </div>

            ) : selectedUser ? (

              <div className="details-content">


                {/* AVATAR */}

                <div className="details-avatar">

                  {selectedUser.name
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>


                {/* NAME */}

                <h3>
                  {selectedUser.name}
                </h3>


                {/* ROLE */}

                <RoleBadge
                  user={selectedUser}
                />



                {/* DETAILS */}

                <div className="details-grid">


                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedUser.email ||
                        "—"}
                    </strong>

                  </div>



                  <div>

                    <span>
                      Address
                    </span>

                    <strong>
                      {selectedUser.address ||
                        "—"}
                    </strong>

                  </div>



                  <div>

                    <span>
                      Role
                    </span>

                    <strong>
                      {getRoleName(
                        selectedUser
                      ).replace(
                        "_",
                        " "
                      )}
                    </strong>

                  </div>



                  <div>

                    <span>
                      User ID
                    </span>

                    <strong>
                      #{selectedUser.id}
                    </strong>

                  </div>



                  {selectedUser.created_at && (

                    <div>

                      <span>
                        Created At
                      </span>

                      <strong>
                        {new Date(
                          selectedUser.created_at
                        ).toLocaleString()}
                      </strong>

                    </div>

                  )}

                </div>



                {/* STORE OWNER RATING */}

                {getRoleName(
                  selectedUser
                ) === "STORE_OWNER" && (

                  <div className="owner-rating">

                    <Store size={20} />

                    <div>

                      <span>
                        Store Rating
                      </span>

                      <strong>
                        {
                          selectedUser.average_rating ??
                          selectedUser.rating ??
                          "—"
                        }
                      </strong>

                    </div>

                  </div>

                )}

              </div>

            ) : null}

          </div>

        </div>

      )}

    </div>

  );

};


export default AdminUsers;