
const express = require("express");

const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");

const {
    getStores
} = require("../controllers/store.controller");


const router = express.Router();


// =====================================================
// NORMAL USER - STORE LISTING
// =====================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("USER"),
    getStores
);


module.exports = router;

