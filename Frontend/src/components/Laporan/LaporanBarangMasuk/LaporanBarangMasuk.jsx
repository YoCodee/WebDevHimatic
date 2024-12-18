import React, { useState, useEffect } from "react";
import BarangMasukChart from "../../Chart/ChartBarangMasuk/BarangMasukChart";
import axios from "axios";
const LaporanBarangMasuk = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/barangMasuk/all")
      .then((res) => setData(res.data.data));
  }, []);

  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <header className="bg-white shadow rounded-md p-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Laporan Barang Masuk
          </h1>
          <p className="text-gray-600 mt-2">
            Page ini menampilkan Laporan Data Barang Masuk
          </p>
        </header>

        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex space-x-2">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>/</li>
            <li>Laporan</li>
            <li>/</li>
            <li className="text-gray-800 font-medium">Laporan Barang Masuk</li>
          </ol>
        </nav>

        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Grafik Laporan Barang Masuk
          </h2>
          <div className="">
            <BarangMasukChart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanBarangMasuk;
