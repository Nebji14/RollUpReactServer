import express from "express";
import {
  login,
  register,
  verifyMail,
  currentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
//  middleware

const router = express.Router();

// Routes "publique"
router.post("/", register); // inscription
router.post("/login", login); // connexion
router.get("/verifyMail/:token", verifyMail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Routes protégées
router.get("/current", protect, currentUser);
router.delete("/deleteToken", protect, logoutUser);

export default router;
