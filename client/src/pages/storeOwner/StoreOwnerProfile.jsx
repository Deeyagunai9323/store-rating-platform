import {
  useAuth,
} from "../../context/AuthContext";

import {
  UserCircle,
  ShieldCheck,
} from "lucide-react";


const StoreOwnerProfile = () => {

  const {
    user,
  } = useAuth();


  return (

    <div>

      <div className="owner-header">

        <div>

          <span className="page-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Profile
          </h1>

          <p>
            Store owner account information.
          </p>

        </div>

      </div>


      <div className="profile-card">

        <div className="profile-avatar">

          {user?.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <div>

          <h2>
            {user?.name || "Store Owner"}
          </h2>

          <p>
            {user?.email}
          </p>

          <span>
            STORE OWNER
          </span>

        </div>

      </div>


      <div className="profile-info-card">

        <h2>
          Account Information
        </h2>

        <div className="profile-grid">

          <div>

            <span>
              Name
            </span>

            <strong>
              {user?.name || "—"}
            </strong>

          </div>


          <div>

            <span>
              Email
            </span>

            <strong>
              {user?.email || "—"}
            </strong>

          </div>


          <div>

            <span>
              Address
            </span>

            <strong>
              {user?.address || "—"}
            </strong>

          </div>


          <div>

            <span>
              Role
            </span>

            <strong>
              {user?.role || "STORE_OWNER"}
            </strong>

          </div>

        </div>

      </div>


      <div className="profile-info-card">

        <div className="password-heading">

          <ShieldCheck
            size={22}
          />

          <div>

            <h2>
              Account Security
            </h2>

            <p>
              Password management for
              Store Owners is not currently
              exposed by the backend API.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default StoreOwnerProfile;