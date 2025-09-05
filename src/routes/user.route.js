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

const router = express.Router();

router.post("/", register);

router.post("/login", login);

router.get("/verifyMail/:token", verifyMail);

router.get("/current", currentUser);

router.delete("/deleteToken", logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
