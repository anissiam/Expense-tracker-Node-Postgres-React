import {pool} from "../libs/database.js";
import {comparePassword, hashPassword} from "../libs/index.js";

export const getUser = async (req, res) => {
    try {
        const {userId} = req.user
        const userExist = await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [userId]
        });
        const user = userExist.rows[0];

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User Not found"
            })
        }
        user.password = undefined;

        res.status(200).json({
            status: "success",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const {userId} = req.user
        const {firstname , lastname, country , city , contact ,currency} = req.body
        const userExist = await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [userId]
        });
        const user = userExist.rows[0];

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User Not found"
            })
        }

        const updatedUser = await pool.query({
            text: "UPDATE tbluser SET firstName = $1, lastName = $2, country = $3, contact = $4 ,currency=$5 ,updatedat= current_timestamp WHERE id = $6 RETURNING *",
            values: [firstname, lastname , country , contact ,currency , userId]
        })

        const newUser = updatedUser.rows[0];
        newUser.password = undefined;

        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            user: newUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const {userId} = req.user;
        const {currentPassword, confirmPassword, newPassword} = req.body;

        const userExist = await pool.query({
            text: "SELECT * FROM tbluser WHERE id = $1",
            values: [userId]
        })
        const user = userExist.rows[0];
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User Not found"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                status: "failed",
                message: "New password and confirm password do not match"
            })
        }

        const isMatch = await comparePassword(currentPassword, user.password)
        if (!isMatch) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid current password"
            })
        }
        const hashedPassword = await hashPassword(newPassword);
        await pool.query({
            text: "UPDATE tbluser SET password = $1 WHERE id = $2",
            values: [hashedPassword, userId]
        })
        res.status(200).json({
            status: "success",
            message: "Password changed successfully"

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}