const express = require("express");


// =====================================================
// MIDDLEWARE
// =====================================================

const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");

const validate =
    require("../middleware/validation.middleware");


// =====================================================
// CONTROLLER
// =====================================================

const {

    getDashboard,

    createUser,

    getUsers,

    getUserById,

    createStore,

    getStores

} = require("../controllers/admin.controller");


// =====================================================
// VALIDATORS
// =====================================================

const {

    createUserValidation,

    createStoreValidation,

    userListValidation,

    storeListValidation

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


// -----------------------------------------------------
// CREATE USER / ADMIN / STORE OWNER
// -----------------------------------------------------

router.post(

    "/users",

    authenticate,

    authorizeRoles("ADMIN"),

    createUserValidation,

    validate,

    createUser

);


// -----------------------------------------------------
// LIST USERS
// Search + Filter + Sort
// -----------------------------------------------------

router.get(

    "/users",

    authenticate,

    authorizeRoles("ADMIN"),

    userListValidation,

    validate,

    getUsers

);


// -----------------------------------------------------
// USER DETAILS
// -----------------------------------------------------

router.get(

    "/users/:id",

    authenticate,

    authorizeRoles("ADMIN"),

    getUserById

);


// =====================================================
// STORE MANAGEMENT
// =====================================================


// -----------------------------------------------------
// CREATE STORE
// -----------------------------------------------------

router.post(

    "/stores",

    authenticate,

    authorizeRoles("ADMIN"),

    createStoreValidation,

    validate,

    createStore

);


// -----------------------------------------------------
// LIST STORES
// Search + Filter + Sort
// -----------------------------------------------------

router.get(

    "/stores",

    authenticate,

    authorizeRoles("ADMIN"),

    storeListValidation,

    validate,

    getStores

);


module.exports = router;