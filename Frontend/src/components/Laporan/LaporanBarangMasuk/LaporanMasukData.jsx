import React, { useState, useEffect } from "react";
import BarangMasukData from "../../Chart/ChartBarangMasuk/BarangMasukData";
import axios from "axios";

const LaporanMasukData = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [mostSoldItem, setMostSoldItem] = useState(null);
  const [leastSoldItem, setLeastSoldItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangMasuk/all"
        );
        const data = response.data.data;

        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.namaBarang]) {
            acc[item.namaBarang] = 0;
          }
          acc[item.namaBarang] += item.quantity;
          return acc;
        }, {});

        const total = Object.values(groupedData).reduce(
          (sum, qty) => sum + qty,
          0
        );
        setTotalQuantity(total);

        const sortedItems = Object.entries(groupedData).sort(
          ([, a], [, b]) => b - a
        );
        setMostSoldItem({
          name: sortedItems[0][0],
          quantity: sortedItems[0][1],
        });
        setLeastSoldItem({
          name: sortedItems[sortedItems.length - 1][0],
          quantity: sortedItems[sortedItems.length - 1][1],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <div className="p-6 bg-gray-100 min-h-screen">
          <header className="bg-white shadow rounded-md p-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Laporan Barang Masuk Paling Banyak
            </h1>
            <p className="text-gray-600 mt-2">
              Analisis dan visualisasi barang Masuk paling banyak.
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
              <li className="text-gray-800 font-medium">
                Laporan Barang Masuk Paling Banyak
              </li>
            </ol>
          </nav>

          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Grafik Laporan Barang Masuk Paling Banyak
            </h2>
            <div className="flex items-center justify-center">
              <BarangMasukData />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md shadow">
              <h3 className="text-purple-700 font-semibold">
                Total Barang Masuk
              </h3>
              <p className="text-purple-600 text-lg font-medium">
                {totalQuantity}
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow">
              <h3 className="text-green-700 font-semibold">
                Barang Paling Banyak Masuk
              </h3>
              <p className="text-green-600 text-lg font-medium">
                {mostSoldItem
                  ? `${mostSoldItem.name} (${mostSoldItem.quantity})`
                  : "Loading..."}
              </p>
            </div>

            {/* Least Sold Item */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow">
              <h3 className="text-red-700 font-semibold">
                Barang Paling Sedikit Masuk
              </h3>
              <p className="text-red-600 text-lg font-medium">
                {leastSoldItem
                  ? `${leastSoldItem.name} (${leastSoldItem.quantity})`
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanMasukData;
