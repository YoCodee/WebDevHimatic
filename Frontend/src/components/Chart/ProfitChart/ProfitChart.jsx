import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProfitChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [maxProfit, setMaxProfit] = useState({ date: null, profit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangKeluar/all"
        );
        const data = response.data.data;

        // Extract unique years from the data
        const uniqueYears = [
          ...new Set(data.map((item) => new Date(item.date).getFullYear())),
        ];
        setYears(uniqueYears);

        // Filter data for the selected year
        filterDataByYear(data, selectedYear);
      } catch (error) {
        console.error("Error fetching profit data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const filterDataByYear = (data, year) => {
    const filteredData = data.filter(
      (item) => new Date(item.date).getFullYear() === year
    );

    // Format data for the chart
    const labels = filteredData.map((item) => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });

    const profits = filteredData.map((item) => item.profit);

    // Find max profit
    const maxProfitItem = filteredData.reduce(
      (max, curr) => (curr.profit > max.profit ? curr : max),
      { date: null, profit: 0 }
    );

    setMaxProfit({
      date: new Date(maxProfitItem.date).toLocaleDateString("id-ID"),
      profit: maxProfitItem.profit,
    });

    setChartData({
      labels,
      datasets: [
        {
          label: `Profit Tahun ${year}`,
          data: profits,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
    setLoading(false);
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      {/* Year Selector */}
      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2 font-bold">
          Pilih Tahun:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Profit Tahun ${selectedYear}`,
              position: "top",
            },
          },
        }}
      />

      {/* Additional Notes */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-lg font-bold text-gray-700 mb-2">
          Catatan Tambahan
        </h4>
        {maxProfit.date && (
          <p className="text-gray-600">
            <span className="font-semibold">Tanggal Profit Tertinggi:</span>{" "}
            {maxProfit.date}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-semibold">Jumlah Profit Tertinggi:</span>{" "}
          {maxProfit.profit.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </p>
      </div>
    </div>
  );
};

export default ProfitChart;
