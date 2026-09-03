const express = require("express");

const {
    register,
    login
} = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation
} = require("../validators/auth.validator");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");


const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    registerValidation,
    register
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    loginValidation,
    login
);


// ==========================================
// TEST AUTHENTICATION
// ==========================================

router.get(
    "/me",
    authenticate,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Authentication successful.",
            user: req.user
        });

    }
);


// ==========================================
// TEST ADMIN AUTHORIZATION
// ==========================================

router.get(
    "/admin-test",
    authenticate,
    authorizeRoles("ADMIN"),
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Admin authorization successful.",
            user: req.user
        });

    }
);


module.exports = router;