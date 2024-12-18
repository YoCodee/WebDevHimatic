import express from "express";
import {
  Login,
  Logout,
  Register,
  getAll,
  deleteUser,
} from "../controller/AuthController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/all", getAll);
router.delete("/delete/:id", deleteUser);

export default router;
