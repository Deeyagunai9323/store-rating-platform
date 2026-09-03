const { body } = require("express-validator");


// =====================================================
// CHANGE PASSWORD VALIDATION
// =====================================================

const changePasswordValidation = [

    body("current_password")
        .notEmpty()
        .withMessage("Current password is required."),

    body("new_password")
        .notEmpty()
        .withMessage("New password is required.")

        .isLength({
            min: 8,
            max: 16
        })
        .withMessage(
            "New password must be between 8 and 16 characters."
        )

        .matches(/[A-Z]/)
        .withMessage(
            "New password must contain at least one uppercase letter."
        )

        .matches(/[^A-Za-z0-9]/)
        .withMessage(
            "New password must contain at least one special character."
        )

];


module.exports = {
    changePasswordValidation
};