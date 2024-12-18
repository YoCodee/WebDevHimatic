import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StokPerKategoriChart from '../../Chart/ChartBarang/stokBarangPerkategori/StokPerKategoriChart';

const LaporanBarang = () => {
  const [totalBarang, setTotalBarang] = useState(0);
  const [kategoriTertinggi, setKategoriTertinggi] = useState({ kategori: '', stok: 0 });
  const [kategoriTerendah, setKategoriTerendah] = useState({ kategori: '', stok: 0 });

  useEffect(() => {
    // Fetch data dari API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/barang/all');
        const data = response.data.barang;

        // Menghitung total barang dari semua stok
        const total = data.reduce((sum, item) => sum + item.stok, 0);
        setTotalBarang(total);

        // Mengelompokkan stok berdasarkan kategori
        const kategoriMap = data.reduce((acc, item) => {
          acc[item.kategori] = (acc[item.kategori] || 0) + item.stok;
          return acc;
        }, {});

        // Mencari kategori dengan stok tertinggi dan terendah
        let tertinggi = { kategori: '', stok: 0 };
        let terendah = { kategori: '', stok: Infinity };

        for (const [kategori, stok] of Object.entries(kategoriMap)) {
          if (stok > tertinggi.stok) {
            tertinggi = { kategori, stok };
          }
          if (stok < terendah.stok) {
            terendah = { kategori, stok };
          }
        }

        setKategoriTertinggi(tertinggi);
        setKategoriTerendah(terendah);
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
        <h1 className="text-2xl font-semibold text-gray-800">Laporan Barang</h1>
        <p className="text-gray-600 mt-2">
          Analisis stok barang berdasarkan kategori untuk membantu pengambilan keputusan.
        </p>
      </header>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex space-x-2">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li>Laporan</li>
          <li>/</li>
          <li className="text-gray-800 font-medium">Laporan Barang</li>
        </ol>
      </nav>

      {/* Content Section */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Grafik Stok Barang Per Kategori</h2>
        <div className="flex justify-center items-center">
          {/* Chart Component */}
          <StokPerKategoriChart />
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow">
          <h3 className="text-blue-700 font-semibold">Total Barang</h3>
          <p className="text-blue-600 text-lg font-medium">{totalBarang} Items</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow">
          <h3 className="text-green-700 font-semibold">Kategori Tertinggi</h3>
          <p className="text-green-600 text-lg font-medium">
            {kategoriTertinggi.kategori} ({kategoriTertinggi.stok} Items)
          </p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow">
          <h3 className="text-yellow-700 font-semibold">Kategori Terendah</h3>
          <p className="text-yellow-600 text-lg font-medium">
            {kategoriTerendah.kategori} ({kategoriTerendah.stok} Items)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaporanBarang;
