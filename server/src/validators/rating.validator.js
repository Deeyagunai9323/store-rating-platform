
const { body } = require("express-validator");


// =====================================================
// CREATE RATING VALIDATION
// =====================================================

const createRatingValidation = [

    body("store_id")
        .notEmpty()
        .withMessage("Store ID is required.")

        .isInt({
            min: 1
        })
        .withMessage(
            "Store ID must be a valid positive integer."
        ),

    body("rating")
        .notEmpty()
        .withMessage("Rating is required.")

        .isInt({
            min: 1,
            max: 5
        })
        .withMessage(
            "Rating must be an integer between 1 and 5."
        )

];


// =====================================================
// UPDATE RATING VALIDATION
// =====================================================

const updateRatingValidation = [

    body("rating")
        .notEmpty()
        .withMessage("Rating is required.")

        .isInt({
            min: 1,
            max: 5
        })
        .withMessage(
            "Rating must be an integer between 1 and 5."
        )

];


module.exports = {

    createRatingValidation,

    updateRatingValidation

};

