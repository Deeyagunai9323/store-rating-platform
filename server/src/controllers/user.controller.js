const bcrypt = require("bcryptjs");

const { pool } = require("../config/database");


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {

    try {

        const {
            current_password,
            new_password
        } = req.body;


        // -------------------------------------------------
        // Get logged-in user from JWT
        // -------------------------------------------------

        const userId = req.user.id;


        // -------------------------------------------------
        // Get user's current password
        // -------------------------------------------------

        const [users] = await pool.execute(

            `SELECT
                id,
                password

             FROM users

             WHERE id = ?

             LIMIT 1`,

            [userId]

        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        const user = users[0];


        // -------------------------------------------------
        // Verify current password
        // -------------------------------------------------

        const passwordMatches = await bcrypt.compare(

            current_password,

            user.password

        );


        if (!passwordMatches) {

            return res.status(401).json({

                success: false,

                message: "Current password is incorrect."

            });

        }


        // -------------------------------------------------
        // Prevent same password
        // -------------------------------------------------

        const samePassword = await bcrypt.compare(

            new_password,

            user.password

        );


        if (samePassword) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from the current password."

            });

        }


        // -------------------------------------------------
        // Hash new password
        // -------------------------------------------------

        const hashedPassword = await bcrypt.hash(

            new_password,

            10

        );


        // -------------------------------------------------
        // Update password
        // -------------------------------------------------

        await pool.execute(

            `UPDATE users

             SET password = ?

             WHERE id = ?`,

            [
                hashedPassword,
                userId
            ]

        );


        // -------------------------------------------------
        // Success response
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Password updated successfully."

        });

    } catch (error) {

        console.error(
            "Change Password Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message: "Failed to update password."

        });

    }

};


module.exports = {
    changePassword
};