import React, {useState, useEffect} from 'react'
import BarangKeluarChart from '../../Chart/ChartBarangKeluar/BarangKeluarChart'
import axios from 'axios'
const LaporanBarangKeluar = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      axios
        .get("http://localhost:5000/api/barangKeluar/all")
        .then((res) => setData(res.data.data));
    }, []);
  
  return (
    <div>

        <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <header className="bg-white shadow rounded-md p-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Laporan Barang Keluar
          </h1>
          <p className="text-gray-600 mt-2">
            Page ini menampilkan Laporan Data Barang Keluar 
          </p>
        </header>

        {/* Breadcrumbs */}
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
            <li className="text-gray-800 font-medium">Laporan Barang Keluar</li>
          </ol>
        </nav>

        {/* Content Section */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Grafik Laporan Barang Keluar
          </h2>
          <div className="">
            {/* Chart Component */}
            <BarangKeluarChart data={data}/>
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}

export default LaporanBarangKeluar