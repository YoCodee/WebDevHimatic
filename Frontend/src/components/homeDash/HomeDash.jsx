import React, { useState, useEffect } from "react";
import axios from "axios";
import CardHomeDsh from "../CardHomeDash/CardHomeDsh";
import { FaUserCircle, FaTruckLoading, FaDollyFlatbed } from "react-icons/fa";

import ProfitChart from "../Chart/ProfitChart/ProfitChart";
import { FaBoxArchive } from "react-icons/fa6";
import BarangChart from "../Chart/ChartBarang/BarangChart";
const HomeDash = () => {
  const [barang, setBarang] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [user,setUser] = useState([]);
  const [profit, setProfit] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangKeluar/all"
        );
        setBarangKeluar(response.data.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/all"
        );
        setUser(response.data.users.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barang/all"
        );
        setBarang(response.data.barang);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData()

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangMasuk/all"
        );
        setBarangMasuk(response.data.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangKeluar/all"
        );
        const totalProfit = response.data.data.reduce(
          (acc, curr) => acc + curr.profit,
          0
        );
        setProfit(totalProfit);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const lowStockItems = barang.filter((item) => item.stok < 10);

  return (
    <div className="pl-2 overflow-y-scroll h-screen">
      {/* Dashboard Cards */}
      <div className="mt-12 flex flex-wrap gap-5">
        <CardHomeDsh
          bgColor="bg-gradient-to-r from-orange-500 to-yellow-500"
          SubJudul={barang.length}
          icon={FaBoxArchive}
          TitleAtas="Data Barang"
        />
        <CardHomeDsh
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
          SubJudul={barangMasuk}
          icon={FaTruckLoading}
          TitleAtas="Barang Masuk"
        />
        <CardHomeDsh
          bgColor="bg-gradient-to-r from-red-500 to-red-700"
          SubJudul={barangKeluar}
          icon={FaDollyFlatbed}
          TitleAtas="Barang Keluar"
        />
        <CardHomeDsh
          bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
          SubJudul={user}
          icon={FaUserCircle}
          TitleAtas="Total User"
        />
      </div>

      {/* Info Stock and Profit */}
      <div className="flex flex-wrap gap-5 mr-12 my-8">
        {/* Info Stock Barang */}
        <div className="infoStock bg-white px-4 py-3 shadow-md border-t-2 border-red-500 rounded-xl flex-1">
          <h1 className="text-3xl py-5 font-bold">Info Stok Barang</h1>
          <div className="border-t-2 border-gray-200 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">
                    Nama Barang
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Stok</th>
                  <th className="px-4 py-2 border border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <tr key={item._id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {item.namaBarang}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.stok}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-red-500 font-bold">
                        Stok Kurang
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-2 border border-gray-300 text-center"
                      colSpan="3"
                    >
                      Semua barang memiliki stok mencukupi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mb-20">
              <BarangChart />
            </div>
          </div>
        </div>

        {/* Profit Section */}
        <div className="Profit bg-white px-4 py-3 shadow-md border-t-2 border-green-500 rounded-xl flex-1 flex flex-col items-center">
          <h1 className="text-3xl py-5 font-bold">Profit</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="text-green-500 text-5xl font-extrabold">
              + Rp {profit.toLocaleString("id-ID")}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Total profit dari barang keluar</p>
          <div className="mt-4 w-full pb-20">
            <ProfitChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDash;
