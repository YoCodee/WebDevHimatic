import express from "express";
import {createBarangKeluar,deleteBarangKeluar,getAllBarangKeluar,getBarangKeluarById} from "../controller/BarangKeluarController.js"
import { isAdmin } from "../middlewares/middleware.js";


const router = express.Router();


router.post("/create",createBarangKeluar)
router.delete("/delete/:id",deleteBarangKeluar)
router.get("/all",getAllBarangKeluar)
router.get("/get/:id",getBarangKeluarById)


export default router