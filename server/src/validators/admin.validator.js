const { body, query, param } = require("express-validator");


// =====================================================
// COMMON NAME VALIDATION
// =====================================================

const nameValidation = body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({
        min: 20,
        max: 60
    })
    .withMessage(
        "Name must be between 20 and 60 characters."
    );


// =====================================================
// EMAIL VALIDATION
// =====================================================

const emailValidation = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.");


// =====================================================
// PASSWORD VALIDATION
// =====================================================

const passwordValidation = body("password")
    .notEmpty()
    .withMessage("Password is required.")
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
    );


// =====================================================
// ADDRESS VALIDATION
// =====================================================

const addressValidation = body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required.")
    .isLength({
        max: 400
    })
    .withMessage(
        "Address cannot exceed 400 characters."
    );


// =====================================================
// ADD USER / ADMIN / STORE OWNER
// =====================================================

const createUserValidation = [

    nameValidation,

    emailValidation,

    passwordValidation,

    addressValidation,

    body("role")
        .notEmpty()
        .withMessage("Role is required.")
        .isIn([
            "ADMIN",
            "USER",
            "STORE_OWNER"
        ])
        .withMessage(
            "Role must be ADMIN, USER or STORE_OWNER."
        )

];


// =====================================================
// ADD STORE
// =====================================================

const createStoreValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required.")
        .isLength({
            max: 100
        })
        .withMessage(
            "Store name cannot exceed 100 characters."
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Store email is required.")
        .isEmail()
        .withMessage(
            "Please provide a valid store email."
        ),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Store address is required.")
        .isLength({
            max: 400
        })
        .withMessage(
            "Store address cannot exceed 400 characters."
        ),

    body("owner_id")
        .notEmpty()
        .withMessage("Store owner is required.")
        .isInt({
            min: 1
        })
        .withMessage(
            "owner_id must be a valid positive integer."
        )

];


// =====================================================
// LIST FILTER VALIDATION
// =====================================================

// =====================================================
// LIST FILTER VALIDATION
// =====================================================

const userListValidation = [

    query("name")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            max: 60
        })
        .withMessage(
            "Name filter cannot exceed 60 characters."
        ),

    query("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage(
            "Email filter must be valid."
        ),

    query("address")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            max: 400
        })
        .withMessage(
            "Address filter cannot exceed 400 characters."
        ),

    query("role")
        .optional({ checkFalsy: true })
        .trim()
        .isIn([
            "ADMIN",
            "USER",
            "STORE_OWNER"
        ])
        .withMessage(
            "Invalid role filter."
        ),

    query("sortBy")
        .optional({ checkFalsy: true })
        .isIn([
            "name",
            "email",
            "address",
            "role",
            "created_at"
        ])
        .withMessage(
            "Invalid sort field."
        ),

    query("order")
        .optional({ checkFalsy: true })
        .toUpperCase()
        .isIn([
            "ASC",
            "DESC"
        ])
        .withMessage(
            "Sort order must be ASC or DESC."
        )

];


// =====================================================
// STORE LIST VALIDATION
// =====================================================

// =====================================================
// STORE LIST VALIDATION
// =====================================================

const storeListValidation = [

    query("name")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            max: 100
        })
        .withMessage(
            "Store name filter cannot exceed 100 characters."
        ),

    query("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage(
            "Email filter must be valid."
        ),

    query("address")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            max: 400
        })
        .withMessage(
            "Address filter cannot exceed 400 characters."
        ),

    query("sortBy")
        .optional({ checkFalsy: true })
        .isIn([
            "name",
            "email",
            "address",
            "created_at",
            "rating"
        ])
        .withMessage(
            "Invalid store sort field."
        ),

    query("order")
        .optional({ checkFalsy: true })
        .toUpperCase()
        .isIn([
            "ASC",
            "DESC"
        ])
        .withMessage(
            "Sort order must be ASC or DESC."
        )

];


module.exports = {

    createUserValidation,

    createStoreValidation,

    userListValidation,

    storeListValidation

};