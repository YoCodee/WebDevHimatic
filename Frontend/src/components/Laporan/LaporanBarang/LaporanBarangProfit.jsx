import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitPerBarangChart from '../../Chart/ChartBarang/ProfitPerBarang/ProfitPerBarangChart';

const LaporanBarangProfit = () => {
  const [totalProfit, setTotalProfit] = useState(0);
  const [categoryProfitTertinggi, setCategoryProfitTertinggi] = useState({ kategori: '', profit: 0 });
  const [categoryProfitTerendah, setCategoryProfitTerendah] = useState({ kategori: '', profit: 0 });

  useEffect(() => {
    // Fetch data dari API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/barang/all');
        const data = response.data.barang;

        // Group by category and calculate profit for each category
        const profitByCategory = data.reduce((acc, item) => {
          const profitPerItem = (item.hargaJual - item.hargaBeli) * item.stok;
          
          // Add to existing category profit
          if (acc[item.kategori]) {
            acc[item.kategori] += profitPerItem;
          } else {
            acc[item.kategori] = profitPerItem;
          }

          return acc;
        }, {});

        // Calculate total profit across all categories
        const total = Object.values(profitByCategory).reduce((sum, profit) => sum + profit, 0);
        setTotalProfit(total);

        // Find the highest and lowest profit category
        let tertinggi = { kategori: '', profit: 0 };
        let terendah = { kategori: '', profit: Infinity };

        for (const [kategori, profit] of Object.entries(profitByCategory)) {
          if (profit > tertinggi.profit) {
            tertinggi = { kategori, profit };
          }
          if (profit < terendah.profit) {
            terendah = { kategori, profit };
          }
        }

        setCategoryProfitTertinggi(tertinggi);
        setCategoryProfitTerendah(terendah);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow rounded-md p-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Laporan Barang - Profit</h1>
        <p className="text-gray-600 mt-2">
          Analisis profit barang untuk memahami performa produk secara keseluruhan.
        </p>
      </header>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex space-x-2">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li>Laporan</li>
          <li>/</li>
          <li className="text-gray-800 font-medium">Laporan Barang - Profit</li>
        </ol>
      </nav>

      {/* Content Section */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Grafik Profit Per Kategori</h2>
        <div className="flex justify-center items-center">
          {/* Chart Component */}
          <ProfitPerBarangChart />
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md shadow">
          <h3 className="text-purple-700 font-semibold">Total Profit</h3>
          <p className="text-purple-600 text-lg font-medium">Rp {totalProfit.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow">
          <h3 className="text-green-700 font-semibold">Kategori Profit Tertinggi</h3>
          <p className="text-green-600 text-lg font-medium">
            {categoryProfitTertinggi.kategori} (Rp {categoryProfitTertinggi.profit.toLocaleString('id-ID')})
          </p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow">
          <h3 className="text-red-700 font-semibold">Kategori Profit Terendah</h3>
          <p className="text-red-600 text-lg font-medium">
            {categoryProfitTerendah.kategori} (Rp {categoryProfitTerendah.profit.toLocaleString('id-ID')})
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaporanBarangProfit;
