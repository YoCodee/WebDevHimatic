import mongoose from "mongoose";

const barangKeluarSchema = new mongoose.Schema(
  {
    kodeBarang: { type: String, required: true }, 
    namaBarang: { type: String, required: true },
    quantity: { type: Number, required: true },
    customer: { type: String, required: true },
    profit: {
      type: Number,
      required: true, // Menyimpan profit per transaksi
    },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

const BarangKeluarModel = mongoose.model("BarangKeluar", barangKeluarSchema);
export default BarangKeluarModel;
