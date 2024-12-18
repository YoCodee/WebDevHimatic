import express from "express";
import {createBarangMasuk,deleteBarangMasuk,getAllBarangMasuk,getBarangMasukById, updateBarangMasuk} from "../controller/BarangMasukController.js"
import { isAdmin } from "../middlewares/middleware.js";

const router = express.Router();


router.post("/create",createBarangMasuk)
router.delete("/delete/:id",deleteBarangMasuk)
router.get("/all",getAllBarangMasuk)
router.get("/get/:id",getBarangMasukById)
router.put("/update/:id",updateBarangMasuk)


export default router