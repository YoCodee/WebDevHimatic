import express from "express";
import {createBarang,deleteBarang,getAllBarang,getBarangById,updateBarang,importBarang} from '../controller/BarangController.js'
import {isAdmin} from "../middlewares/middleware.js"
import { uploadCsv } from "../middlewares/uploadCsv.js";
const router = express.Router();

router.post('/import', uploadCsv.single('file'), importBarang);
router.post("/create", isAdmin,createBarang)
router.delete("/delete/:id",isAdmin,deleteBarang)
router.get("/all",getAllBarang)
router.get("/get/:id",getBarangById)
router.put("/update/:id",updateBarang)

export default router