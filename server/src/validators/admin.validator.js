const { body } = require("express-validator");


// =====================================================
// CREATE USER VALIDATION
// =====================================================

const createUserValidation = [

    body("name")
        .trim()
        .isLength({
            min: 20,
            max: 60
        })
        .withMessage(
            "Name must be between 20 and 60 characters."
        ),

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        ),

    body("password")
        .isLength({
            min: 8,
            max: 16
        })
        .withMessage(
            "Password must be between 8 and 16 characters."
        )
        .matches(/[A-Z]/)
        .withMessage(
            "Password must contain at least one uppercase letter."
        )
        .matches(/[^A-Za-z0-9]/)
        .withMessage(
            "Password must contain at least one special character."
        ),

    body("address")
        .trim()
        .isLength({
            max: 400
        })
        .withMessage(
            "Address cannot exceed 400 characters."
        ),

    body("role")
        .isIn([
            "ADMIN",
            "USER",
            "STORE_OWNER"
        ])
        .withMessage(
            "Role must be ADMIN, USER, or STORE_OWNER."
        )

];


// =====================================================
// CREATE STORE VALIDATION
// =====================================================

const createStoreValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage(
            "Store name is required."
        )
        .isLength({
            max: 100
        })
        .withMessage(
            "Store name cannot exceed 100 characters."
        ),

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid store email."
        ),

    body("address")
        .trim()
        .notEmpty()
        .withMessage(
            "Store address is required."
        )
        .isLength({
            max: 400
        })
        .withMessage(
            "Address cannot exceed 400 characters."
        ),

    body("owner_id")
        .optional()
        .isInt({
            min: 1
        })
        .withMessage(
            "owner_id must be a valid user ID."
        )

];


module.exports = {
    createUserValidation,
    createStoreValidation
};