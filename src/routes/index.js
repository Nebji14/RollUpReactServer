import express from "express";
import userRoutes from "./user.route.js";
import tableRoute from "./table.route.js";

const router = express.Router();

// Routes utilisateurs
router.use("/user", userRoutes);

// Routes tables
router.use("/tables", tableRoute);

export default router;
