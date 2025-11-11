import {pool} from "../libs/database.js";
import {comparePassword, createJWT, hashPassword} from "../libs/index.js";

export const signinUser = async (req, res) => {
    try {
        const {email, password}= req.body;
        const result = await pool.query({
            text: "SELECT * FROM tbluser WHERE email = $1",
            values: [email]
        })

        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            })
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid email or password"
            })
        }

        const token = createJWT(user.id)

        user.password = undefined; // Remove password from the response

        res.status(200).json({
            status: "success",
            message: "User signed in successfully",
            user ,
            token
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

export const signupUser = async (req, res) => {
    try {
        const {firstName , email , password} = req.body;
        console.log(firstName + " " + email + " " + password)
        if(!firstName || !email || !password){
            return res.status(404).json({
                status: "failed",
                message: "All fields are required"
            })
        }
        const userExist = await pool.query({
            text: "SELECT EXISTS( SELECT * FROM tbluser WHERE email = $1)",
            values: [email]
        })

        if (userExist.rows[0].userExist){
          return res.status(409).json({
              status: "failed",
              message: "User already exists"
          })
        }

        const hashPassword_ = await hashPassword(password)

        const user = await pool.query({
            text: "INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *",
            values: [firstName, email, hashPassword_]
        })

        user.rows[0].password= undefined

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: {
                user: user.rows[0]
            }
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

/*
export const signinUser = async (req, res) => {
    try {

    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}
*/
