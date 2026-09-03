require("dotenv").config();

const bcrypt = require("bcryptjs");

const {
    pool
} = require("../config/database");


const createAdmin = async () => {

    try {

        const name = "System Administrator Account";

        const email = "admin@storerating.com";

        const password = "Admin@123";

        const address = "System Administration Office";


        // Find ADMIN role
        const [roles] = await pool.execute(
            `SELECT id
             FROM roles
             WHERE name = 'ADMIN'
             LIMIT 1`
        );


        if (roles.length === 0) {

            throw new Error(
                "ADMIN role does not exist."
            );

        }


        const roleId = roles[0].id;


        // Check existing admin
        const [existingUsers] = await pool.execute(
            `SELECT id
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );


        if (existingUsers.length > 0) {

            console.log(
                "Admin account already exists."
            );

            process.exit(0);

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


        // Create admin
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


        console.log(
            `Admin created successfully. ID: ${result.insertId}`
        );

        console.log(
            `Email: ${email}`
        );

        console.log(
            `Password: ${password}`
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Admin creation failed:",
            error.message
        );

        process.exit(1);

    }

};


createAdmin();