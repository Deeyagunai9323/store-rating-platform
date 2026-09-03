
const bcrypt = require("bcryptjs");

const { pool } = require("../config/database");


// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {

    try {

        const [[userCount]] = await pool.execute(
            `SELECT COUNT(*) AS totalUsers
             FROM users`
        );

        const [[storeCount]] = await pool.execute(
            `SELECT COUNT(*) AS totalStores
             FROM stores`
        );

        const [[ratingCount]] = await pool.execute(
            `SELECT COUNT(*) AS totalRatings
             FROM ratings`
        );

        return res.status(200).json({

            success: true,

            data: {
                totalUsers: userCount.totalUsers,
                totalStores: storeCount.totalStores,
                totalRatings: ratingCount.totalRatings
            }

        });

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard."
        });

    }

};


// =====================================================
// CREATE USER / ADMIN / STORE OWNER
// =====================================================

const createUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;


        // -------------------------------------------------
        // Check duplicate email
        // -------------------------------------------------

        const [existingUsers] = await pool.execute(

            `SELECT id
             FROM users
             WHERE email = ?
             LIMIT 1`,

            [email.trim()]

        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });

        }


        // -------------------------------------------------
        // Find role ID
        // -------------------------------------------------

        const [roles] = await pool.execute(

            `SELECT id
             FROM roles
             WHERE name = ?
             LIMIT 1`,

            [role]

        );


        if (roles.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Selected role does not exist."
            });

        }


        const roleId = roles[0].id;


        // -------------------------------------------------
        // Hash password
        // -------------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


        // -------------------------------------------------
        // Create user
        // -------------------------------------------------

        const [result] = await pool.execute(

            `INSERT INTO users
                (
                    name,
                    email,
                    password,
                    address,
                    role_id
                )

             VALUES
                (?, ?, ?, ?, ?)`,

            [
                name.trim(),
                email.trim(),
                hashedPassword,
                address.trim(),
                roleId
            ]

        );


        return res.status(201).json({

            success: true,

            message: "User created successfully.",

            user: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                role
            }

        });

    } catch (error) {

        console.error(
            "Create User Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create user."
        });

    }

};


// =====================================================
// GET USERS
// Search + Filter + Sort
// =====================================================

const getUsers = async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            role,
            sort = "name",
            order = "asc"
        } = req.query;


        // -------------------------------------------------
        // Allowed sorting columns
        // -------------------------------------------------

        const allowedSortColumns = {

            name: "u.name",

            email: "u.email",

            address: "u.address",

            role: "r.name",

            created_at: "u.created_at"

        };


        const sortColumn =
            allowedSortColumns[sort] || "u.name";


        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";


        // -------------------------------------------------
        // Base query
        // -------------------------------------------------

        let query = `

            SELECT

                u.id,
                u.name,
                u.email,
                u.address,
                r.name AS role,
                u.created_at

            FROM users u

            INNER JOIN roles r
                ON u.role_id = r.id

            WHERE 1 = 1

        `;


        const params = [];


        // -------------------------------------------------
        // Filter by name
        // -------------------------------------------------

        if (name) {

            query += `
                AND u.name LIKE ?
            `;

            params.push(`%${name}%`);

        }


        // -------------------------------------------------
        // Filter by email
        // -------------------------------------------------

        if (email) {

            query += `
                AND u.email LIKE ?
            `;

            params.push(`%${email}%`);

        }


        // -------------------------------------------------
        // Filter by address
        // -------------------------------------------------

        if (address) {

            query += `
                AND u.address LIKE ?
            `;

            params.push(`%${address}%`);

        }


        // -------------------------------------------------
        // Filter by role
        // -------------------------------------------------

        if (role) {

            query += `
                AND r.name = ?
            `;

            params.push(role);

        }


        // -------------------------------------------------
        // Sorting
        // -------------------------------------------------

        query += `
            ORDER BY ${sortColumn} ${sortOrder}
        `;


        const [users] = await pool.execute(
            query,
            params
        );


        return res.status(200).json({

            success: true,

            count: users.length,

            data: users

        });

    } catch (error) {

        console.error(
            "Get Users Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });

    }

};


// =====================================================
// GET USER DETAILS
// =====================================================

const getUserById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // -------------------------------------------------
        // Get user
        // -------------------------------------------------

        const [users] = await pool.execute(

            `SELECT

                u.id,
                u.name,
                u.email,
                u.address,
                r.name AS role,
                u.created_at,
                u.updated_at

             FROM users u

             INNER JOIN roles r
                ON u.role_id = r.id

             WHERE u.id = ?

             LIMIT 1`,

            [id]

        );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }


        const user = users[0];


        // -------------------------------------------------
        // Store Owner Details
        // -------------------------------------------------

        if (user.role === "STORE_OWNER") {

            const [stores] = await pool.execute(

                `SELECT

                    s.id,
                    s.name,
                    s.email,
                    s.address,

                    COALESCE(
                        ROUND(AVG(r.rating), 2),
                        0
                    ) AS averageRating,

                    COUNT(r.id) AS totalRatings

                 FROM stores s

                 LEFT JOIN ratings r
                    ON s.id = r.store_id

                 WHERE s.owner_id = ?

                 GROUP BY
                    s.id,
                    s.name,
                    s.email,
                    s.address,
                    s.created_at`,

                [user.id]

            );


            user.stores = stores;

        }


        return res.status(200).json({

            success: true,

            data: user

        });

    } catch (error) {

        console.error(
            "Get User Details Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details."
        });

    }

};


// =====================================================
// CREATE STORE
// =====================================================

const createStore = async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            owner_id
        } = req.body;


        // -------------------------------------------------
        // Check duplicate store email
        // -------------------------------------------------

        const [existingStores] = await pool.execute(

            `SELECT id
             FROM stores
             WHERE email = ?
             LIMIT 1`,

            [email.trim()]

        );


        if (existingStores.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "A store with this email already exists."
            });

        }


        // -------------------------------------------------
        // Validate Store Owner
        // -------------------------------------------------

        if (owner_id) {

            const [owners] = await pool.execute(

                `SELECT
                    u.id

                 FROM users u

                 INNER JOIN roles r
                    ON u.role_id = r.id

                 WHERE u.id = ?
                 AND r.name = 'STORE_OWNER'

                 LIMIT 1`,

                [owner_id]

            );


            if (owners.length === 0) {

                return res.status(400).json({
                    success: false,
                    message:
                        "owner_id must belong to a Store Owner."
                });

            }

        }


        // -------------------------------------------------
        // Create Store
        // -------------------------------------------------

        const [result] = await pool.execute(

            `INSERT INTO stores
                (
                    name,
                    email,
                    address,
                    owner_id
                )

             VALUES
                (?, ?, ?, ?)`,

            [
                name.trim(),
                email.trim(),
                address.trim(),
                owner_id || null
            ]

        );


        return res.status(201).json({

            success: true,

            message: "Store created successfully.",

            store: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                address: address.trim(),
                owner_id: owner_id || null
            }

        });

    } catch (error) {

        console.error(
            "Create Store Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create store."
        });

    }

};


// =====================================================
// GET STORES
// Search + Filter + Sort
// =====================================================

const getStores = async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            sort = "name",
            order = "asc"
        } = req.query;


        // -------------------------------------------------
        // Allowed sorting columns
        // -------------------------------------------------

        const allowedSortColumns = {

            name: "s.name",

            email: "s.email",

            address: "s.address",

            rating: "average_rating",

            created_at: "s.created_at"

        };


        const sortColumn =
            allowedSortColumns[sort] || "s.name";


        const sortOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";


        // -------------------------------------------------
        // Base query
        // -------------------------------------------------

        let query = `

            SELECT

                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,

                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS average_rating,

                COUNT(r.id) AS total_ratings

            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            WHERE 1 = 1

        `;


        const params = [];


        // -------------------------------------------------
        // Filter by name
        // -------------------------------------------------

        if (name) {

            query += `
                AND s.name LIKE ?
            `;

            params.push(`%${name}%`);

        }


        // -------------------------------------------------
        // Filter by email
        // -------------------------------------------------

        if (email) {

            query += `
                AND s.email LIKE ?
            `;

            params.push(`%${email}%`);

        }


        // -------------------------------------------------
        // Filter by address
        // -------------------------------------------------

        if (address) {

            query += `
                AND s.address LIKE ?
            `;

            params.push(`%${address}%`);

        }


        // -------------------------------------------------
        // Group results
        // -------------------------------------------------

        query += `

            GROUP BY

                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                s.created_at

        `;


        // -------------------------------------------------
        // Sorting
        // -------------------------------------------------

        query += `
            ORDER BY ${sortColumn} ${sortOrder}
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


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getDashboard,

    createUser,

    getUsers,

    getUserById,

    createStore,

    getStores

};

