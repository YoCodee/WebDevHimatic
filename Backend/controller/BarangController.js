import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import BarangModel from "../models/BarangModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateKodeBarang = async (kategori) => {
  const lastBarang = await BarangModel.find({ kategori })
    .sort({ kodeBarang: -1 })
    .limit(1);

  let nomorUrut = 1;
  if (lastBarang.length > 0) {
    const lastKodeBarang = lastBarang[0].kodeBarang;
    nomorUrut = parseInt(lastKodeBarang.split("-")[1]) + 1;
  }

  const kodeBarang = `${kategori.toUpperCase()}-${String(nomorUrut).padStart(
    3,
    "0"
  )}`;

  return kodeBarang;
};

export const importBarang = async (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      console.log("Row read from CSV:", row);
      results.push(row);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");

      if (results.length > 0) {
        try {
          for (const row of results) {
            const { namaBarang, kategori, stok, hargaBeli, hargaJual } = row;

            const existingBarang = await BarangModel.findOne({
              namaBarang,
            })

            if(existingBarang){
              return res.status(400).json({
                message: "Barang dengan nama yang sama sudah ada di database",
              });
            }

            const barang = new BarangModel({
              kodeBarang: await generateKodeBarang(kategori),
              namaBarang,
              kategori,
              stok: parseInt(stok),
              hargaBeli: parseInt(hargaBeli),
              hargaJual: parseInt(hargaJual),
            });

            await barang.save();
          }

          res.status(201).json({
            message: "Import barang berhasil",
            data: results,
          });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({
              message: "Terjadi kesalahan saat menyimpan data",
              error: error.message,
            });
        }
      } else {
        res.status(400).json({ message: "Tidak ada data untuk diimpor" });
      }
    });
};

export const createBarang = async (req, res) => {
  const { namaBarang, kategori, stok, hargaBeli, hargaJual, date } = req.body;

  const kodeBarang = await generateKodeBarang(kategori);

  try {
    // Cek apakah barang sudah ada berdasarkan nama
    const isBarangExist = await BarangModel.findOne({ namaBarang });

    if (isBarangExist) {
      return res.status(400).json({ message: "Nama barang sudah ada di database" });
    }

    // Gunakan date dari input, atau tanggal sekarang sebagai default
    const currentDate = date ? new Date(date) : new Date();

    const barang = await BarangModel.create({
      kodeBarang,
      namaBarang,
      kategori,
      stok,
      hargaBeli,
      hargaJual,
      date: currentDate, // Pastikan ini diisi dengan tanggal yang valid
    });

    res.status(201).json({ message: "Barang berhasil dibuat", barang });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal membuat barang", error: err.message });
  }
};


export const getAllBarang = async (req, res) => {
  try {
    const barang = await BarangModel.find();
    res
      .status(200)
      .json({ message: "Berhasil mendapatkan semua barang", barang });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mendapatkan semua barang", error: err.message });
  }
};

export const getBarangById = async (req, res) => {
  const { id } = req.params;
  try {
    const barang = await BarangModel.findById(id);
    if (!barang)
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    res.status(200).json({ message: "Berhasil mendapatkan barang", barang });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mendapatkan barang", error: err.message });
  }
};

export const updateBarang = async (req, res) => {
  const { id } = req.params;
  const { kodeBarang, namaBarang, kategori, stok, hargaBeli, hargaJual,date } =
    req.body;


  try {

    const barang = await BarangModel.findById(id);
    if (!barang)
      return res.status(404).json({ message: "Barang tidak ditemukan" });


    barang.kodeBarang = kodeBarang || barang.kodeBarang;
    barang.namaBarang = namaBarang || barang.namaBarang;
    barang.kategori = kategori || barang.kategori;
    barang.stok = stok || barang.stok;
    barang.hargaBeli = hargaBeli || barang.hargaBeli;
    barang.hargaJual = hargaJual || barang.hargaJual;
    barang.date = date || barang.date;

    // Simpan perubahan
    await barang.save();

    res.status(200).json({ message: "Berhasil memperbarui barang", barang });
  } catch (err) {
    console.error(err); 
    res
      .status(500)
      .json({ message: "Gagal memperbarui barang", error: err.message });
  }
};

export const deleteBarang = async (req, res) => {
  const { id } = req.params;
  try {
    const barang = await BarangModel.findOneAndDelete({ _id: id }); 
    if (!barang)
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    res.status(200).json({ message: "Berhasil menghapus barang", barang });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus barang", error: err.message });
  }
};
