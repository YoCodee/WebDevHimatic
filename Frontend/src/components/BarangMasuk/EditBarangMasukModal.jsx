import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBarangMasukModal = ({
  showModal,
  setShowModal,
  barangMasukToEdit,
  setbarangMasukToEdit,
  setBarangMasuk,
  setShowEditSuccessModal
  
}) => {
 const [formData, setFormData] = useState({});

  useEffect(() => {
    if (barangMasukToEdit) {
      setFormData(
        barangMasukToEdit
      );
    }
  }, [barangMasukToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBarangMasuk = (updatedBarangMasuk) => {
    setBarangMasuk((prev) =>
      prev.map((item) =>
        item._id === updatedBarangMasuk._id ? updatedBarangMasuk : item
      )
    );
  };
  
  const handleEditBarang = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/barangMasuk/update/${barangMasukToEdit._id}`,
        formData
      );
      handleUpdateBarangMasuk(response.data.data); // Call the reusable function
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
        <h2 className="text-xl font-bold mb-4">Edit Barang Masuk</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Jumlah Barang</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Catatan</label>
          <textarea
            name="note"
            value={formData.note || ""}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full"
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

export default EditBarangMasukModal;
