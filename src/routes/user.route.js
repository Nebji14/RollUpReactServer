import express from "express";
import {
  login,
  register,
  verifyMail,
  currentUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", register);

router.post("/login", login);

router.get("/verifyMail/:token", verifyMail);

router.get("/current", currentUser);

export default router;
