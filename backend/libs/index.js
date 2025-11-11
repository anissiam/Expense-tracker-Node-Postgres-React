import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const hashPassword =async (userValue)=>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userValue, salt);
    return hashedPassword;
}

export const comparePassword = async (userValue, hashedPassword)=>{
    try {
        const isMatch =await bcrypt.compare(userValue, hashedPassword);
        return isMatch;
    }catch (error) {
        console.log(error)
    }
}
export const createJWT = (id) => {
    return jwt.sign(
        {
            userId: id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

export function getMonthName(index) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[index];
}