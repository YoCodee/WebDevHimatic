import BarangMasukModel from "../models/BarangMasukModel.js";
import BarangModel from "../models/BarangModel.js";

export const createBarangMasuk = async (req, res) => {
    const { kodeBarang, quantity, supplier, note } = req.body;

    try {
        const barang = await BarangModel.findOne({ kodeBarang });

        if (!barang) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        barang.stok += quantity;
        await barang.save();
        const barangMasuk = new BarangMasukModel({
            kodeBarang,
            namaBarang: barang.namaBarang,
            quantity,
            supplier,
            note,
        });

        await barangMasuk.save();

        res.status(201).json({ message: 'Barang masuk berhasil ditambahkan dan stok diperbarui!', data: barangMasuk });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
export const getAllBarangMasuk = async (req, res) => {
    try {
        const barangMasuk = await BarangMasukModel.find();
        res.status(200).json({ message: 'Berhasil mendapatkan semua barang masuk', data: barangMasuk });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

export const getBarangMasukById = async (req, res) => {
    const { id } = req.params;
    try {
        const barangMasuk = await BarangMasukModel.findById(id);
        if (!barangMasuk) {
            return res.status(404).json({ message: 'Barang masuk tidak ditemukan' });
        }
        res.status(200).json({ message: 'Berhasil mendapatkan barang masuk', data: barangMasuk });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }   
};

export const deleteBarangMasuk = async (req, res) => {
    const { id } = req.params;
    try {
        const barangMasuk = await BarangMasukModel.findByIdAndDelete(id);
        if (!barangMasuk) {
            return res.status(404).json({ message: 'Barang masuk tidak ditemukan' });
        }
        res.status(200).json({ message: 'Berhasil menghapus barang masuk', data: barangMasuk });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

export const updateBarangMasuk = async (req, res) => {
    const { id } = req.params;
    const { quantity, supplier, note } = req.body;
    try {
        const barangMasuk = await BarangMasukModel.findById(id);
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
        res.status(200).json({ message: 'Berhasil memperbarui barang masuk', data: barangMasuk });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
