import express from "express";
import {
    addMoneyToAccount,
    createAccount,
    getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middeleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createAccount);
router.get("/", authMiddleware, getAccounts);
router.get("/:id", authMiddleware, getAccounts);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);

export default router;