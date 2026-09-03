
const { pool } = require("../config/database");


// =====================================================
// CREATE RATING
// =====================================================

const createRating = async (req, res) => {

    try {

        const {
            store_id,
            rating
        } = req.body;


        // -------------------------------------------------
        // Logged-in user
        // -------------------------------------------------

        const userId = req.user.id;


        // -------------------------------------------------
        // Check whether store exists
        // -------------------------------------------------

        const [stores] = await pool.execute(

            `SELECT id
             FROM stores
             WHERE id = ?
             LIMIT 1`,

            [store_id]

        );


        if (stores.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Store not found."

            });

        }


        // -------------------------------------------------
        // Check whether user has already rated this store
        // -------------------------------------------------

        const [existingRatings] = await pool.execute(

            `SELECT
                id,
                rating

             FROM ratings

             WHERE user_id = ?
             AND store_id = ?

             LIMIT 1`,

            [
                userId,
                store_id
            ]

        );


        if (existingRatings.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "You have already rated this store. Use the update rating option.",

                data: {
                    rating_id: existingRatings[0].id,
                    rating: existingRatings[0].rating
                }

            });

        }


        // -------------------------------------------------
        // Insert rating
        // -------------------------------------------------

        const [result] = await pool.execute(

            `INSERT INTO ratings
                (
                    user_id,
                    store_id,
                    rating
                )

             VALUES
                (?, ?, ?)`,

            [
                userId,
                store_id,
                rating
            ]

        );


        return res.status(201).json({

            success: true,

            message: "Rating submitted successfully.",

            data: {

                rating_id: result.insertId,

                user_id: userId,

                store_id: Number(store_id),

                rating: Number(rating)

            }

        });

    } catch (error) {

        // -------------------------------------------------
        // Database UNIQUE constraint protection
        // -------------------------------------------------

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "You have already rated this store. Use the update rating option."

            });

        }


        console.error(
            "Create Rating Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message: "Failed to submit rating."

        });

    }

};

// =====================================================
// UPDATE RATING
// =====================================================

const updateRating = async (req, res) => {

    try {

        const {
            storeId
        } = req.params;

        const {
            rating
        } = req.body;


        // -------------------------------------------------
        // Logged-in user
        // -------------------------------------------------

        const userId = req.user.id;


        // -------------------------------------------------
        // Check whether store exists
        // -------------------------------------------------

        const [stores] = await pool.execute(

            `SELECT id
             FROM stores
             WHERE id = ?
             LIMIT 1`,

            [storeId]

        );


        if (stores.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Store not found."

            });

        }


        // -------------------------------------------------
        // Find user's existing rating
        // -------------------------------------------------

        const [existingRatings] = await pool.execute(

            `SELECT
                id,
                rating

             FROM ratings

             WHERE user_id = ?
             AND store_id = ?

             LIMIT 1`,

            [
                userId,
                storeId
            ]

        );


        // -------------------------------------------------
        // User has not rated this store
        // -------------------------------------------------

        if (existingRatings.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "You have not submitted a rating for this store yet."

            });

        }


        // -------------------------------------------------
        // Update existing rating
        // -------------------------------------------------

        await pool.execute(

            `UPDATE ratings

             SET rating = ?

             WHERE user_id = ?
             AND store_id = ?`,

            [
                rating,
                userId,
                storeId
            ]

        );


        // -------------------------------------------------
        // Return updated rating
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Rating updated successfully.",

            data: {

                rating_id: existingRatings[0].id,

                user_id: userId,

                store_id: Number(storeId),

                old_rating:
                    existingRatings[0].rating,

                rating: Number(rating)

            }

        });

    } catch (error) {

        console.error(
            "Update Rating Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message: "Failed to update rating."

        });

    }

};



module.exports = {
    createRating,
    updateRating
};

