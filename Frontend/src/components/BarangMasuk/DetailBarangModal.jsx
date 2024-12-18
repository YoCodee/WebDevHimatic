
import React from "react";
const DetailBarangModal = ({ isOpen, onClose, barangDetail }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Detail Barang</h2>
          <p className="mb-2 text-xl"><strong>Note:</strong> {barangDetail.note}</p>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default DetailBarangModal;