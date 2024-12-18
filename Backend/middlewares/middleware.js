import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js"; 

export const isAdmin = async (req, res, next) => {
  try {

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan" });


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan" });


    if (user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak, Anda bukan admin" });
    }

  
    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Akses ditolak, token tidak valid", error: err.message });
  }
};
