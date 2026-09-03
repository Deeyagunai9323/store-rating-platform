const express = require("express");

const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");

const {
    getStoreOwnerDashboard
} = require("../controllers/storeOwner.controller");


const router = express.Router();


// =====================================================
// STORE OWNER DASHBOARD
// =====================================================

router.get(

    "/dashboard",

    authenticate,

    authorizeRoles("STORE_OWNER"),

    getStoreOwnerDashboard

);


module.exports = router;