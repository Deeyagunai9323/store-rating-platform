const express = require("express");

const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");

const {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores
} = require("../controllers/admin.controller");
const {
    createUserValidation,
    createStoreValidation
} = require("../validators/admin.validator");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    authenticate,
    authorizeRoles("ADMIN"),
    getDashboard
);


// =====================================================
// USER MANAGEMENT
// =====================================================

router.post(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    createUserValidation,
    createUser
);


router.get(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    getUsers
);


router.get(
    "/users/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    getUserById
);


// =====================================================
// STORE MANAGEMENT
// =====================================================

router.post(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    createStoreValidation,
    createStore
);


router.get(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    getStores
);


module.exports = router;