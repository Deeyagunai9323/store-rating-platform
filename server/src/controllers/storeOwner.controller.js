const { pool } = require("../config/database");


// =====================================================
// STORE OWNER DASHBOARD
// =====================================================

const getStoreOwnerDashboard = async (req, res) => {

    try {

        const ownerId = req.user.id;


        // -------------------------------------------------
        // Get stores owned by logged-in Store Owner
        // -------------------------------------------------

        const [stores] = await pool.execute(

            `
            SELECT

                s.id,
                s.name,
                s.email,
                s.address,

                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS average_rating,

                COUNT(r.id) AS total_ratings

            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            WHERE s.owner_id = ?

            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address

            ORDER BY s.name ASC
            `,

            [ownerId]

        );


        // -------------------------------------------------
        // No store assigned
        // -------------------------------------------------

        if (stores.length === 0) {

            return res.status(200).json({

                success: true,

                message: "No store is assigned to this Store Owner.",

                data: {
                    stores: []
                }

            });

        }


        // -------------------------------------------------
        // Get users who submitted ratings
        // -------------------------------------------------

        const [ratingUsers] = await pool.execute(

            `
            SELECT

                s.id AS store_id,

                s.name AS store_name,

                u.id AS user_id,

                u.name AS user_name,

                u.email AS user_email,

                u.address AS user_address,

                r.rating,

                r.created_at,
                r.updated_at

            FROM stores s

            INNER JOIN ratings r
                ON s.id = r.store_id

            INNER JOIN users u
                ON r.user_id = u.id

            WHERE s.owner_id = ?

            ORDER BY
                s.name ASC,
                r.created_at DESC
            `,

            [ownerId]

        );


        return res.status(200).json({

            success: true,

            data: {

                stores,

                rating_users: ratingUsers

            }

        });

    } catch (error) {

        console.error(
            "Store Owner Dashboard Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch Store Owner dashboard."

        });

    }

};


module.exports = {
    getStoreOwnerDashboard
};