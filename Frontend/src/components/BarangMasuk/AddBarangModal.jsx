import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBarangModal = ({
  isOpen,
  onClose,
  onSuccess,
  setAddBarangSucces,
}) => {
  const [kodeBarang, setKodeBarang] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [barangList, setBarangList] = useState([]);

  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barang/all"
        );
        setBarangList(response.data.barang);
      } catch (error) {
        console.error("Error fetching barang list:", error);
      }
    };

    fetchBarangList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/barangMasuk/create",
        {
          kodeBarang,
          quantity,
          supplier,
          note,
        }
      );
      onSuccess(response.data.data);
      setAddBarangSucces(true);
      onClose();
    } catch (error) {
      console.error("Error adding barang masuk:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Tambah Barang Masuk</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="kodeBarang" className="block text-sm font-medium">
              Kode Barang
            </label>
            <select
              id="kodeBarang"
              value={kodeBarang}
              onChange={(e) => setKodeBarang(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Pilih Kode Barang</option>
              {barangList.map((barang) => (
                <option key={barang.kodeBarang} value={barang.kodeBarang}>
                  {barang.kodeBarang} - {barang.namaBarang}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="supplier" className="block text-sm font-medium">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium">
              Note
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBarangModal;
