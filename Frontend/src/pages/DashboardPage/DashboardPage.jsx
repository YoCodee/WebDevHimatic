import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaStream, FaCaretDown } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaTruckLoading } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import "./Dashboard.css";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContect";
import { FaFileInvoiceDollar } from "react-icons/fa";

import { FaFileInvoice } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
// Usage example

const DashboardPage = () => {
  const { user, isLoading } = useContext(AuthContext); // Ambil isLoading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect ke login hanya jika user tidak ada dan selesai loading
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    // Tampilkan spinner atau pesan loading
    return <div>Loading...</div>;
  }
  // State untuk mengontrol dropdown menu
  const [isMasterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [isColDropDown, setIsColDropDown] = useState(false);
  const [LaporanMasuk, setLaporanMasuk] = useState(false);
  const [LaporanKeluar, setLaporanKeluar] = useState(false);

  return (
    <>
      <div className="dashboard-container  flex h-screen mr-2 mt-3  ">
        <aside
          className={`sidebar hidden md:block w-[350px] py-4 mx-2 mb-6 rounded-xl p-[20px] text-white`}
        >
          <div className="title">
            <h1 className="text-2xl font-bold text-center py-3 border-b-2">
              INVENTORY
            </h1>
          </div>
          <div className="flex flex-col justify-between h-full pb-16">
            <ul className="list-none py-2">
             
              <Link
                to="/dashboard/Home"
                className={`py-2 rounded-md flex items-center  pl-2 ${
                  location.pathname === "/dashboard/Home" ? "bg-blue-500" : ""
                }`}
              >
                <FaHome className="mr-2" /> <h1>Home</h1>
              </Link>

      
              <div className="relative">
                <h1 className="py-2 font-bold">Barang</h1>
                <button
                  onClick={() => setMasterDropdownOpen(!isMasterDropdownOpen)}
                  className={`py-2 rounded-md flex items-center my-2 pl-2 w-full ${
                    location.pathname.includes("/dashboard/History")
                      ? "bg-blue-500"
                      : ""
                  }`}
                >
                  <FaStream className="mr-2" />
                  <h1>Master</h1>
                  <FaCaretDown className="ml-auto" />
                </button>

        
                {isMasterDropdownOpen && (
                  <ul className="ml-2 mt-2 space-y-2 ">
                    <li>
                      <Link
                        to="/dashboard/Master/Barang"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaPlusCircle className="mr-2" />
                        Barang
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/Master/barangMasuk"
                        className="flex items-center py-1 pl-4 rounded-md hover:bg-blue-600"
                      >
                        <FaBoxOpen className="mr-2" />
                        Barang Masuk
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/Master/BarangKeluar"
                        className="flex items-center py-1 pl-4 rounded-md hover:bg-blue-600"
                      >
                        <FaTruckLoading className="mr-2" />
                        Barang Keluar
                      </Link>
                    </li>
                  </ul>
                )}

                <h1 className="py-2 font-bold">Laporan </h1>
                <Link
                  to="/dashboard/Laporan/Comparision"
                  className="flex items-center py-1 pl-4 rounded-md hover:bg-blue-600"
                >
                  <FaTruckLoading className="mr-2" />
                  Tren Barang
                </Link>
                <button
                  onClick={() => setIsColDropDown(!isColDropDown)}
                  className={`py-2 rounded-md flex items-center my-2 pl-2 w-full ${
                    location.pathname.includes("/dashboard/History")
                      ? "bg-blue-500"
                      : ""
                  }`}
                >
                  <FaFileAlt className="mr-2" />
                  <h1>Laporan Barang</h1>
                  <FaCaretDown className="ml-auto" />
                </button>
                {isColDropDown && (
                  <ul className="ml-2 mt-2 space-y-2 ">
                    <li>
                      <Link
                        to="/dashboard/LaporanMasuk/Barang"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" />
                        Stok Barang
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/LaporanMasuk/Profit"
                        className="flex items-center py-1 pl-4 rounded-md hover:bg-blue-600"
                      >
                        <FaDollarSign className="mr-2" />
                        Profit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/LaporanMasuk/Tren"
                        className="flex items-center py-1 pl-4 rounded-md hover:bg-blue-600"
                      >
                        <FaChartLine className="mr-2" />
                        Tren
                      </Link>
                    </li>
                  </ul>
                )}
                <button
                  onClick={() => setLaporanMasuk(!LaporanMasuk)}
                  className={`py-2 rounded-md flex items-center my-2 pl-2 w-full ${
                    location.pathname.includes("/dashboard/History")
                      ? "bg-blue-500"
                      : ""
                  }`}
                >
                  <FaFileImport className="mr-2" />
                  <h1 className="">Laporan Masuk</h1>
                  <FaCaretDown className="ml-auto" />
                </button>
                {LaporanMasuk && (
                  <ul className="ml-2 mt-2 space-y-2 ">
                    <li>
                      <Link
                        to="/dashboard/LaporanMasuk/Masuk"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" />
                        Barang Masuk
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/LaporanMasuk/BarangData"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" />
                        Barang Data
                      </Link>
                    </li>
                  </ul>
                )}
                <button
                  onClick={() => setLaporanKeluar(!LaporanKeluar)}
                  className={`py-2 rounded-md flex items-center my-2 pl-2 w-full ${
                    location.pathname.includes("/dashboard/History")
                      ? "bg-blue-500"
                      : ""
                  }`}
                >
                  <FaFileExport className="mr-2" />
                  <h1 className="">Laporan Keluar</h1>
                  <FaCaretDown className="ml-auto" />
                </button>
                {LaporanKeluar && (
                  <ul className="ml-2 mt-2 space-y-2 ">
                    <li>
                      <Link
                        to="/dashboard/LaporanKeluar/Keluar"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" />
                        Barang Keluar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/LaporanKeluar/Barang"
                        className=" py-1 pl-4 flex items-center rounded-md hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" />
                        Barang Data
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </ul>

            {user.role === "admin" && (
              <Link
                to="/dashboard/Setting"
                className={`py-2 rounded-md flex items-center my-2 pl-2 w-full ${
                  location.pathname.includes("/dashboard/History")
                    ? "bg-blue-500"
                    : ""
                }`}
              >
                <FcSettings className="mr-2" />
                <h1 className="">Setting</h1>
              </Link>
            )}
          </div>
        </aside>

        <main className="dashboard-content flex-grow">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
