const bcrypt = require("bcryptjs");

const { pool } = require("../config/database");


// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {

    try {

        const [[userCount]] = await pool.execute(
            `
            SELECT COUNT(*) AS total_users
            FROM users
            `
        );

        const [[storeCount]] = await pool.execute(
            `
            SELECT COUNT(*) AS total_stores
            FROM stores
            `
        );

        const [[ratingCount]] = await pool.execute(
            `
            SELECT COUNT(*) AS total_ratings
            FROM ratings
            `
        );

        return res.status(200).json({

            success: true,

            data: {
                total_users: userCount.total_users,
                total_stores: storeCount.total_stores,
                total_ratings: ratingCount.total_ratings
            }

        });

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch dashboard data."

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
        // Check whether email already exists
        // -------------------------------------------------

        const [existingUsers] = await pool.execute(

            `
            SELECT id
            FROM users
            WHERE email = ?
            LIMIT 1
            `,

            [email]

        );


        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Email is already registered."

            });

        }


        // -------------------------------------------------
        // Get role ID
        // -------------------------------------------------

        const [roles] = await pool.execute(

            `
            SELECT id
            FROM roles
            WHERE name = ?
            LIMIT 1
            `,

            [role]

        );


        if (roles.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid role."

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

            `
            INSERT INTO users
            (
                name,
                email,
                password,
                address,
                role_id
            )
            VALUES (?, ?, ?, ?, ?)
            `,

            [
                name,
                email,
                hashedPassword,
                address,
                roleId
            ]

        );


        return res.status(201).json({

            success: true,

            message: "User created successfully.",

            data: {
                id: result.insertId,
                name,
                email,
                address,
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
            sortBy = "name",
            order = "ASC"
        } = req.query;


        const conditions = [];

        const values = [];


        // -------------------------------------------------
        // Name filter
        // -------------------------------------------------

        if (name) {

            conditions.push(
                "u.name LIKE ?"
            );

            values.push(
                `%${name}%`
            );

        }


        // -------------------------------------------------
        // Email filter
        // -------------------------------------------------

        if (email) {

            conditions.push(
                "u.email LIKE ?"
            );

            values.push(
                `%${email}%`
            );

        }


        // -------------------------------------------------
        // Address filter
        // -------------------------------------------------

        if (address) {

            conditions.push(
                "u.address LIKE ?"
            );

            values.push(
                `%${address}%`
            );

        }


        // -------------------------------------------------
        // Role filter
        // -------------------------------------------------

        if (role) {

            conditions.push(
                "r.name = ?"
            );

            values.push(role);

        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        // -------------------------------------------------
        // Whitelist sortable fields
        // -------------------------------------------------

        const sortFields = {

            name: "u.name",

            email: "u.email",

            address: "u.address",

            role: "r.name",

            created_at: "u.created_at"

        };


        const sortColumn =
            sortFields[sortBy] || "u.name";


        const sortOrder =
            order === "DESC"
                ? "DESC"
                : "ASC";


        // -------------------------------------------------
        // Query
        // -------------------------------------------------

        const [users] = await pool.execute(

            `
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

            ${whereClause}

            ORDER BY
                ${sortColumn}
                ${sortOrder}
            `,

            values

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
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {

    try {

        const { id } = req.params;


        const [users] = await pool.execute(

            `
            SELECT

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

            LIMIT 1
            `,

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
        // If Store Owner, get their store rating
        // -------------------------------------------------

        if (user.role === "STORE_OWNER") {

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
                `,

                [id]

            );


            user.stores = stores;

        }


        return res.status(200).json({

            success: true,

            data: user

        });

    } catch (error) {

        console.error(
            "Get User By ID Error:",
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
        // Verify Store Owner
        // -------------------------------------------------

        const [owners] = await pool.execute(

            `
            SELECT

                u.id,
                u.name,
                u.email

            FROM users u

            INNER JOIN roles r
                ON u.role_id = r.id

            WHERE u.id = ?

            AND r.name = 'STORE_OWNER'

            LIMIT 1
            `,

            [owner_id]

        );


        if (owners.length === 0) {

            return res.status(400).json({

                success: false,

                message:
                    "The selected user is not a valid Store Owner."

            });

        }


        // -------------------------------------------------
        // Check duplicate store email
        // -------------------------------------------------

        const [existingStores] = await pool.execute(

            `
            SELECT id
            FROM stores
            WHERE email = ?
            LIMIT 1
            `,

            [email]

        );


        if (existingStores.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "A store with this email already exists."

            });

        }


        // -------------------------------------------------
        // Create Store
        // -------------------------------------------------

        const [result] = await pool.execute(

            `
            INSERT INTO stores
            (
                name,
                email,
                address,
                owner_id
            )
            VALUES (?, ?, ?, ?)
            `,

            [
                name,
                email,
                address,
                owner_id
            ]

        );


        return res.status(201).json({

            success: true,

            message: "Store created successfully.",

            data: {
                id: result.insertId,
                name,
                email,
                address,
                owner_id
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
            sortBy = "name",
            order = "ASC"
        } = req.query;


        const conditions = [];

        const values = [];


        // -------------------------------------------------
        // Name
        // -------------------------------------------------

        if (name) {

            conditions.push(
                "s.name LIKE ?"
            );

            values.push(
                `%${name}%`
            );

        }


        // -------------------------------------------------
        // Email
        // -------------------------------------------------

        if (email) {

            conditions.push(
                "s.email LIKE ?"
            );

            values.push(
                `%${email}%`
            );

        }


        // -------------------------------------------------
        // Address
        // -------------------------------------------------

        if (address) {

            conditions.push(
                "s.address LIKE ?"
            );

            values.push(
                `%${address}%`
            );

        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        // -------------------------------------------------
        // Sort whitelist
        // -------------------------------------------------

        const sortFields = {

            name: "s.name",

            email: "s.email",

            address: "s.address",

            created_at: "s.created_at",

            rating: "average_rating"

        };


        const sortColumn =
            sortFields[sortBy] ||
            "s.name";


        const sortOrder =
            order === "DESC"
                ? "DESC"
                : "ASC";


        // -------------------------------------------------
        // Get stores
        // -------------------------------------------------

        const [stores] = await pool.execute(

            `
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

            ${whereClause}

            GROUP BY

                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id

            ORDER BY
                ${sortColumn}
                ${sortOrder}
            `,

            values

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

    getDashboard,

    createUser,

    getUsers,

    getUserById,

    createStore,

    getStores

};