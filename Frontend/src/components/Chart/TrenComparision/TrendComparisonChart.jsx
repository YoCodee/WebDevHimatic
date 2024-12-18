import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const TrendComparisonChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangMasukRes, barangKeluarRes] = await Promise.all([
          axios.get("http://localhost:5000/api/barangMasuk/all"),
          axios.get("http://localhost:5000/api/barangKeluar/all"),
        ]);

        const barangMasukData = barangMasukRes.data?.data;
        const barangKeluarData = barangKeluarRes.data?.data;

        // Format data by month
        const formatData = (data, key) => {
          return data.reduce((acc, item) => {
            const month = new Date(item.date).toLocaleString("default", {
              month: "short",
            });
            acc[month] = (acc[month] || 0) + item[key];
            return acc;
          }, {});
        };

        const barangMasukByMonth = formatData(barangMasukData, "quantity");
        const barangKeluarByMonth = formatData(barangKeluarData, "quantity");

        const months = Array.from(
          new Set([
            ...Object.keys(barangMasukByMonth),
            ...Object.keys(barangKeluarByMonth),
          ])
        ).sort((a, b) => new Date(`01-${a}-2000`) - new Date(`01-${b}-2000`));

        // Chart data
        setChartData({
          labels: months,
          datasets: [
            {
              label: "Barang Masuk",
              data: months.map((month) => barangMasukByMonth[month] || 0),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Barang Keluar",
              data: months.map((month) => barangKeluarByMonth[month] || 0),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="w-1/3 ">
      <div className="">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default TrendComparisonChart;
