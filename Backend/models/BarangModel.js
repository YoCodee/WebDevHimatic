import mongoose from "mongoose";


const kategoriEnum = ["Elektronik", "Furniture", "Pakaian", "Makanan", "Peralatan Rumah Tangga"];

const barangSchema = new mongoose.Schema({
    kodeBarang: { type: String, required: true, unique: true },
    namaBarang: { type: String, required: true },
    kategori: { 
        type: String, 
        required: true, 
        enum: kategoriEnum, 
    },
    stok: { type: Number, required: true },
    hargaBeli: { type: Number, required: true },
    hargaJual: { type: Number, required: true },
    date : { type: Date, default: Date.now },
  }, { timestamps: true });

const BarangModel = mongoose.model("Barang", barangSchema);
export default BarangModel