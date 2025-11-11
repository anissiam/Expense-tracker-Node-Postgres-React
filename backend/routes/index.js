import express  from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import accountRoutes from "./accountRoutes.js";


const route = express.Router();

route.use("/auth", authRoutes);
route.use("/user", userRoutes);
route.use("/account", accountRoutes);
route.use("/transaction", transactionRoutes);
export default route;