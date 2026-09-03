
const { pool } = require("../config/database");


// =====================================================
// GET ALL STORES
// Search + Sort
// =====================================================

const getStores = async (req, res) => {

    try {

        const {
            name,
            address,
            sort = "name",
            order = "asc"
        } = req.query;


        // -------------------------------------------------
        // Logged-in user ID
        // -------------------------------------------------

        const userId = req.user.id;


        // -------------------------------------------------
        // Allowed sorting columns
        // -------------------------------------------------

        const allowedSortColumns = {

            name: "s.name",

            address: "s.address",

            rating: "average_rating"

        };


        const sortColumn =
            allowedSortColumns[sort] || "s.name";


        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";


        // -------------------------------------------------
        // Base Query
        // -------------------------------------------------

        let query = `

            SELECT

                s.id,

                s.name,

                s.address,

                COALESCE(
                    ROUND(AVG(all_ratings.rating), 2),
                    0
                ) AS average_rating,

                my_rating.rating AS user_rating

            FROM stores s


            -- All ratings are used to calculate
            -- the store's overall average rating

            LEFT JOIN ratings all_ratings
                ON s.id = all_ratings.store_id


            -- Separate join to get the
            -- currently logged-in user's rating

            LEFT JOIN ratings my_rating
                ON s.id = my_rating.store_id
                AND my_rating.user_id = ?


            WHERE 1 = 1

        `;


        const params = [userId];


        // -------------------------------------------------
        // Search by Store Name
        // -------------------------------------------------

        if (name) {

            query += `
                AND s.name LIKE ?
            `;

            params.push(`%${name}%`);

        }


        // -------------------------------------------------
        // Search by Store Address
        // -------------------------------------------------

        if (address) {

            query += `
                AND s.address LIKE ?
            `;

            params.push(`%${address}%`);

        }


        // -------------------------------------------------
        // Group Results
        // -------------------------------------------------

        query += `

            GROUP BY

                s.id,
                s.name,
                s.address,
                my_rating.rating

        `;


        // -------------------------------------------------
        // Sorting
        // -------------------------------------------------

        query += `

            ORDER BY
                ${sortColumn}
                ${sortOrder}

        `;


        const [stores] = await pool.execute(
            query,
            params
        );


        return res.status(200).json({

            success: true,

            count: stores.length,

            data: stores

        });

    } catch (error) {

        console.error(
            "Get Stores Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch stores."

        });

    }

};


module.exports = {
    getStores
};

