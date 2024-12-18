import React, { useEffect } from "react";

const AddBarangModal = ({
  errorAdd,
  showModal,
  setShowModal,
  formData,
  setFormData,
  handleAddBarang,
}) => {
  // Fungsi untuk menangani perubahan nilai input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Set default date to today's date on first render
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format: yyyy-mm-dd
    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate, // Set today's date as default
    }));
  }, []); // This effect runs only once, on component mount

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10 ${showModal ? "block" : "hidden"}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {errorAdd && <p className="text-red-500 mb-4">{errorAdd}</p>}
        <h2 className="text-xl font-bold mb-4">Tambah Barang</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddBarang();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nama Barang</label>
            <input
              type="text"
              name="namaBarang"
              value={formData.namaBarang}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
              className="border px-4 py-2 w-full"
            >
              <option value=".....">.....</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Furniture">Furniture</option>
              <option value="Pakaian">Pakaian</option>
              <option value="Makanan">Makanan</option>
              <option value="Peralatan Rumah Tangga">Peralatan Rumah Tangga</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Stok</label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Harga Beli</label>
            <input
              type="number"
              name="hargaBeli"
              value={formData.hargaBeli}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Harga Jual</label>
            <input
              type="number"
              name="hargaJual"
              value={formData.hargaJual}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Tanggal Barang</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Tambah Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBarangModal;
