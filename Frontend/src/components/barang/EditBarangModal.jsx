import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBarangModal = ({
  showModal,
  setShowModal,
  barangToEdit,
  setBarangToEdit,
  setBarang,
  setShowEditSuccessModal,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (barangToEdit) {
      // Pastikan format tanggal sesuai dengan yyyy-mm-dd
      const formattedDate = new Date(barangToEdit.date)
        .toISOString()
        .split("T")[0];
      setFormData({
        ...barangToEdit,
        date: formattedDate, // Mengupdate field date dengan format yang benar
      });
    }
  }, [barangToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditBarang = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/barang/update/${barangToEdit._id}`,
        formData
      );
      setBarang((prev) =>
        prev.map((item) =>
          item._id === barangToEdit._id ? response.data.barang : item
        )
      );
      setShowModal(false);
      setShowEditSuccessModal(true);
    } catch (error) {
      console.error("Error updating barang:", error);
      alert("Gagal memperbarui barang");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Barang</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nama Barang</label>
          <input
            type="text"
            name="namaBarang"
            value={formData.namaBarang || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Kategori</label>
          <select
            name="kategori"
            value={formData.kategori || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          >
            <option value="" disabled>
              Pilih Kategori
            </option>
            <option value="Elektronik">Elektronik</option>
            <option value="Furniture">Furniture</option>
            <option value="Pakaian">Pakaian</option>
            <option value="Makanan">Makanan</option>
            <option value="Peralatan Rumah Tangga">
              Peralatan Rumah Tangga
            </option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Stok</label>
          <input
            type="number"
            name="stok"
            value={formData.stok || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Harga Beli</label>
          <input
            type="number"
            name="hargaBeli"
            value={formData.hargaBeli || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Harga Jual</label>
          <input
            type="number"
            name="hargaJual"
            value={formData.hargaJual || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Tanggal Barang
          </label>
          <input
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => setShowModal(false)}
          >
            Batal
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleEditBarang}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBarangModal;
