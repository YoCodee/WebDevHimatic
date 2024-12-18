import React from 'react'

import TrenBarangChart from '../../Chart/ChartBarang/TrenTambahBarang/TrenBarangChart'
const LaporanBarangTren = () => {
  return (
    <div>
  
        <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow rounded-md p-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Laporan Barang - Tren Barang </h1>
        <p className="text-gray-600 mt-2">
            Analisis dan visualisasi tren barang berdasarkan penambahan stok.
        </p>
      </header>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex space-x-2">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li>Laporan</li>
          <li>/</li>
          <li className="text-gray-800 font-medium">Laporan Barang - Tren</li>
        </ol>
      </nav>

      {/* Content Section */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Grafik Tren Barang</h2>
        <div className="flex justify-center items-center">
          {/* Chart Component */}
          <TrenBarangChart/>
        </div>
      </div>

      {/* Additional Information */}
     
    </div>
    </div>
  )
}

export default LaporanBarangTren