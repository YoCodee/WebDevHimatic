import mongoose from "mongoose";

const barangMasukSchema = new mongoose.Schema(
  {
    kodeBarang: { type: String, required: true }, 
    namaBarang: { type: String, required: true },
    quantity: { type: Number, required: true },
    supplier: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

const BarangMasukModel = mongoose.model("BarangMasuk", barangMasukSchema);
export default BarangMasukModel;
