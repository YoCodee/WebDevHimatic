import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarangKeluarData = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/barangKeluar/all");
        const data = response.data.data;

        // Process data: Group by namaBarang and sum quantity
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.namaBarang]) {
            acc[item.namaBarang] = 0;
          }
          acc[item.namaBarang] += item.quantity;
          return acc;
        }, {});

        // Sort data by quantity in descending order and take top 5
        const sortedData = Object.entries(groupedData)
          .sort(([, a], [, b]) => b - a) // Sort by quantity (descending)
          .slice(0, 5); // Take top 5 items

        // Prepare chart labels and values
        const labels = sortedData.map(([namaBarang]) => namaBarang); // namaBarang
        const values = sortedData.map(([, quantity]) => quantity); // Total quantity

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Quantity",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Render chart when data is available
  return chartData ? (
    <div className="w-1/3">
      <h2>Laporan Barang Paling Banyak Keluar</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { title: { display: true, text: "Nama Barang" } },
            y: { title: { display: true, text: "Quantity" } },
          },
        }}
      />
    </div>
  ) : (
    <p>Loading chart...</p>
  );
};

export default BarangKeluarData;
