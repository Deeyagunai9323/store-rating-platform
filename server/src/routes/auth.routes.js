const express = require("express");

const {
    register,
    login
} = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation
} = require("../validators/auth.validator");


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


module.exports = router;