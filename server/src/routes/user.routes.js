const express = require("express");

const {
    validationResult
} = require("express-validator");


const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");


const {
    changePassword
} = require("../controllers/user.controller");


const {
    changePasswordValidation
} = require("../validators/user.validator");


const router = express.Router();


// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(

    "/change-password",

    authenticate,

    authorizeRoles("USER"),

    changePasswordValidation,

    (req, res, next) => {

        const errors = validationResult(req);


        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                message: "Validation failed.",

                errors: errors.array()

            });

        }


        next();

    },

    changePassword

);


module.exports = router;