import React, { useEffect, useState } from "react";
import TrendComparisonChart from "../../Chart/TrenComparision/TrendComparisonChart";
import axios from "axios";

function TrenBarang() {
  const [totals, setTotals] = useState({
    totalMasuk: 0,
    totalKeluar: 0,
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [barangMasukRes, barangKeluarRes] = await Promise.all([
          axios.get("http://localhost:5000/api/barangMasuk/all"),
          axios.get("http://localhost:5000/api/barangKeluar/all"),
        ]);

        const barangMasukData = barangMasukRes.data.data;
        const barangKeluarData = barangKeluarRes.data.data;

        // Calculate total quantities
        const totalMasuk = barangMasukData.reduce((sum, item) => sum + item.quantity, 0);
        const totalKeluar = barangKeluarData.reduce((sum, item) => sum + item.quantity, 0);

        setTotals({ totalMasuk, totalKeluar });
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div>
      <div>
        <div>
          <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow rounded-md p-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Laporan Barang Masuk dan Barang Keluar
              </h1>
              <p className="text-gray-600 mt-2">
                Analisis dan visualisasi antara barang masuk dan barang keluar
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
                  Laporan Barang Masuk dan barang keluar
                </li>
              </ol>
            </nav>

            <div className="bg-white shadow-md rounded-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                Grafik Laporan Barang Masuk dan Barang keluar
              </h2>
              <div className="flex items-center justify-center">
                <TrendComparisonChart />
              </div>
            </div>

            {/* Total Barang Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Barang Masuk */}
              <div className="bg-white shadow-md rounded-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Total Barang Masuk</h3>
                <p className="text-2xl font-bold text-green-500 mt-2">
                  {totals.totalMasuk}
                </p>
              </div>

              {/* Total Barang Keluar */}
              <div className="bg-white shadow-md rounded-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Total Barang Keluar</h3>
                <p className="text-2xl font-bold text-red-500 mt-2">
                  {totals.totalKeluar}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrenBarang;
