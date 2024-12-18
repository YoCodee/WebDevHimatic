import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await UserModel.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Kata sandi yang Anda masukkan salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({
      message: "Login berhasil",
      token,
      username: user.username,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login gagal", error: err.message });
  }
};

export const Logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find();
    res
      .status(200)
      .json({ message: "Berhasil mendapatkan semua pengguna", users });
  } catch (err) {
    res.status(500).json({
      message: "Gagal mendapatkan semua pengguna",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil dihapus" });

  } catch(err) {
    res.status(500).json({error: err.message, message: "Gagal menghapus pengguna" });
  }
};
