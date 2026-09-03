
const express = require("express");

const authenticate =
    require("../middleware/auth.middleware");

const authorizeRoles =
    require("../middleware/role.middleware");

const {
    createRating,    updateRating
} = require("../controllers/rating.controller");

const {
    createRatingValidation,  updateRatingValidation
} = require("../validators/rating.validator");

const {
    validationResult
} = require("express-validator");


const router = express.Router();


// =====================================================
// CREATE RATING
// =====================================================

router.post(

    "/",

    authenticate,

    authorizeRoles("USER"),

    createRatingValidation,

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

    createRating

);

// =====================================================
// UPDATE RATING
// =====================================================

router.put(

    "/:storeId",

    authenticate,

    authorizeRoles("USER"),

    updateRatingValidation,

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

    updateRating

);



module.exports = router;

