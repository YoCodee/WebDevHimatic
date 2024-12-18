import BarangKeluarModel from "../models/BarangKeluarModel.js";
import BarangModel from "../models/BarangModel.js";

export const createBarangKeluar = async (req, res) => {
    const { kodeBarang, quantity, customer, note } = req.body;
  
    try {
      const barang = await BarangModel.findOne({ kodeBarang });
  
      if (!barang) {
        return res.status(404).json({ message: 'Barang tidak ditemukan' });
      }
  

      const profitPerItem = barang.hargaJual - barang.hargaBeli;
      const totalProfit = profitPerItem * quantity;

      if (barang.stok < quantity) {
        return res.status(400).json({ message: 'Stok tidak cukup' });
      }
  
      barang.stok -= quantity;
      await barang.save();
  
    
      const barangKeluar = new BarangKeluarModel({
        kodeBarang,
        namaBarang: barang.namaBarang,
        quantity,
        customer,
        note,
        profit: totalProfit, 
      });
  
      await barangKeluar.save();
  
      res.status(201).json({
        message: 'Barang keluar berhasil ditambahkan dan stok diperbarui!',
        data: barangKeluar,
        profit: totalProfit, 
      });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  };
export const getAllBarangKeluar = async (req, res) => {
    try {
        const barangKeluar = await BarangKeluarModel.find();
        res.status(200).json({ message: 'Berhasil mendapatkan semua barang Keluar', data: barangKeluar });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
}

export const getBarangKeluarById = async (req, res) => {
    const { id } = req.params;
    try {
        const barangKeluar = await BarangKeluarModel.findById(id);
        if (!barangKeluar) {
            return res.status(404).json({ message: 'Barang Keluar tidak ditemukan' });
        }
        res.status(200).json({ message: 'Berhasil mendapatkan barang Keluar', data: barangKeluar });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
}

export const deleteBarangKeluar = async (req, res) => {
    const { id } = req.params;
    try {
        const barangKeluar = await BarangKeluarModel.findByIdAndDelete(id);
        if (!barangKeluar) {
            return res.status(404).json({ message: 'Barang Keluar tidak ditemukan' });
        }
        res.status(200).json({ message: 'Berhasil menghapus barang masuk', data: barangKeluar });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

export const updateBarang = async (req, res) => {
  const { id } = req.params;
  const { quantity, supplier, note } = req.body;
  try {
      const barangMasuk = await BarangKeluarModel.findById(id);
      if (!barangMasuk) {
          return res.status(404).json({ message: 'Barang masuk tidak ditemukan' });
      }
      
      const barang = await BarangModel.findOne({ kodeBarang: barangMasuk.kodeBarang });
      if (barang) {
          barang.stok += (quantity - barangMasuk.quantity);
          await barang.save();
      }

      barangMasuk.quantity = quantity;
      barangMasuk.supplier = supplier;
      barangMasuk.note = note;
      
      await barangMasuk.save();
      res.status(200).json({ message: 'Berhasil memperbarui barang keluar', data: barangMasuk });
  } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};
