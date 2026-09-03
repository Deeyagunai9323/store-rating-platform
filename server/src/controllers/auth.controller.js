const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { pool } = require("../config/database");


// ==========================================
// REGISTER USER
// ==========================================

const register = async (req, res) => {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: errors.array()
            });

        }


        const {
            name,
            email,
            address,
            password
        } = req.body;


        // Check whether email already exists
        const [existingUsers] = await pool.execute(
            `SELECT id
             FROM users
             WHERE email = ?`,
            [email]
        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });

        }


        // Get NORMAL USER role
        const [roles] = await pool.execute(
            `SELECT id
             FROM roles
             WHERE name = 'USER'
             LIMIT 1`
        );


        if (roles.length === 0) {

            return res.status(500).json({
                success: false,
                message: "USER role is not configured."
            });

        }


        const roleId = roles[0].id;


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);


        // Insert user
        const [result] = await pool.execute(
            `INSERT INTO users
                (name, email, password, address, role_id)
             VALUES
                (?, ?, ?, ?, ?)`,
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

            message: "Registration successful.",

            user: {
                id: result.insertId,
                name,
                email,
                address,
                role: "USER"
            }

        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: errors.array()
            });

        }


        const {
            email,
            password
        } = req.body;


        // Find user
        const [users] = await pool.execute(

            `SELECT
                u.id,
                u.name,
                u.email,
                u.password,
                u.address,
                u.role_id,
                r.name AS role

             FROM users u

             INNER JOIN roles r
                ON u.role_id = r.id

             WHERE u.email = ?

             LIMIT 1`,

            [email]

        );


        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        const user = users[0];


        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }

        );


        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }

        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};


module.exports = {
    register,
    login
};