import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Layout from "./Layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import HomeDash from "./components/homeDash/HomeDash";
import DashboardBarang from "./components/barang/DashboardBarang";
import DashBarangMasuk from "./components/barangMasuk/DashBarangMasuk";
import DashBarangKeluar from "./components/BarangKeluar/DashBarangKeluar";
import ProtectedRoute from "./context/ProtectedRoute";
import LaporanBarang from "./components/Laporan/LaporanBarang/LaporanBarang";
import LaporanBarangProfit from "./components/Laporan/LaporanBarang/LaporanBarangProfit";
import LaporanBarangTren from "./components/Laporan/LaporanBarang/LaporanBarangTren";
import LaporanBarangMasuk from "./components/Laporan/LaporanBarangMasuk/LaporanBarangMasuk";
import LaporanBarangKeluar from "./components/Laporan/LaporanBarangKeluar/LaporanBarangKeluar";
import LaporanKeluarData from "./components/Laporan/LaporanBarangKeluar/LaporanKeluarData";
import LaporanMasukData from "./components/Laporan/LaporanBarangMasuk/LaporanMasukData";
import TrendComparisonChart from "./components/Chart/TrenComparision/TrendComparisonChart";
import TrenBarang from "./components/Laporan/TrenBarang/TrenBarang";
import SettingPage from "./pages/SettingPage/SettingPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <LoginPage />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/dashboard/home",
              element: <HomeDash />,
            },
            {
              path: "/dashboard/master/barang",
              element: <DashboardBarang />,
            },
            {
              path: "/dashboard/master/barangMasuk",
              element: <DashBarangMasuk />,
            },
            {
              path: "/dashboard/master/barangKeluar",
              element: <DashBarangKeluar />,
            },
            {
              path: "/dashboard/laporanMasuk/Barang",
              element: <LaporanBarang />,
            },
            {
              path : "/dashboard/laporanMasuk/Profit",
              element : <LaporanBarangProfit/>
            },
            {
              path: "/dashboard/laporanMasuk/Tren",
              element : <LaporanBarangTren/>
            },
            {
              path : "/dashboard/LaporanMasuk/Masuk",
              element : <LaporanBarangMasuk/>
            },
            {
              path : "/dashboard/LaporanKeluar/Keluar",
              element : <LaporanBarangKeluar/>
            },
            {
              path: "/dashboard/LaporanKeluar/Barang",
              element : <LaporanKeluarData/>
            },
            {
              path: "/dashboard/LaporanMasuk/BarangData",
              element : <LaporanMasukData/>
            },
            {
              path : "/dashboard/Laporan/Comparision",
              element : <TrenBarang/>
            },
            {
              path : "/dashboard/Setting",
              element : <SettingPage/>
            }
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
