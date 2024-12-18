import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarangKeluarChart = ({ data }) => {
  const chartRef = useRef(null);
  const [filteredData, setFilteredData] = useState(data);
  const [filterType, setFilterType] = useState("tahun"); // Default filter is per year
  const [filterValue, setFilterValue] = useState("2024"); // Default to year 2024
  const [selectedMonth, setSelectedMonth] = useState(null); // For months selection
  const [selectedDay, setSelectedDay] = useState(null); // For day selection
  const [daysInMonth, setDaysInMonth] = useState([]); // Holds the number of days for the selected month

  useEffect(() => {
    // Set the number of days based on the selected month and year
    if (selectedMonth !== null && filterValue !== null) {
      const date = new Date(filterValue, selectedMonth, 0); // Get the last day of the selected month
      const numDays = date.getDate();
      setDaysInMonth(Array.from({ length: numDays }, (_, i) => i + 1)); // Generate an array of days
    }
  }, [selectedMonth, filterValue]);

  useEffect(() => {
    // Filter data based on the filter type
    const filtered = data.filter((item) => {
      const date = new Date(item.date);

      if (filterType === "bulan") {
        // Filter by the selected month in the selected year
        return (
          date.getFullYear() === parseInt(filterValue) &&
          (selectedMonth ? date.getMonth() === selectedMonth : true)
        );
      }

      if (filterType === "tahun") {
        // Filter by the selected year (2020-2024)
        return date.getFullYear() >= 2020 && date.getFullYear() <= 2024;
      }

      if (filterType === "tanggal") {
        // Filter by the specific date (e.g., YYYY-MM-DD)
        return (
          date.getFullYear() === parseInt(filterValue.split("-")[0]) &&
          date.getMonth() === parseInt(filterValue.split("-")[1]) - 1 &&
          date.getDate() === parseInt(selectedDay)
        );
      }

      return true; // Default: return all data
    });

    setFilteredData(filtered);
  }, [filterType, filterValue, selectedMonth, selectedDay, data]);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartRef.current._chartInstance) {
        chartRef.current._chartInstance.destroy();
      }

      // Create a new chart instance
      chartRef.current._chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels:
            filterType === "bulan"
              ? Array.from(
                  { length: 12 },
                  (_, i) => `${2024}-${String(i + 1).padStart(2, "0")}`
                ) // For months: 2024-01, 2024-02, etc.
              : filterType === "tahun"
              ? ["2020", "2021", "2022", "2023", "2024"] // For years: 2020, 2021, ..., 2024
              : [], // For specific days, the labels will not be needed.
          datasets: [
            {
              label: "Jumlah Barang Keluar",
              data:
                filterType === "bulan"
                  ? Array.from({ length: 12 }, (_, i) => {
                      return filteredData
                        .filter((item) => new Date(item.date).getMonth() === i)
                        .reduce((sum, item) => sum + item.quantity, 0);
                    })
                  : filterType === "tahun"
                  ? ["2020", "2021", "2022", "2023", "2024"].map((year) => {
                      return filteredData
                        .filter(
                          (item) =>
                            new Date(item.date).getFullYear() === parseInt(year)
                        )
                        .reduce((sum, item) => sum + item.quantity, 0);
                    })
                  : [], // For specific days, the data will be dynamically calculated based on date input.
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text:
                  filterType === "bulan"
                    ? "Bulan"
                    : filterType === "tahun"
                    ? "Tahun"
                    : "Tanggal",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jumlah Barang",
              },
            },
          },
        },
      });
    }
  }, [filteredData, filterType]);

  return (
    <div>
      <div className="flex justify-center gap-4 my-2">
        <select
          className="border"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setSelectedMonth(null); // Reset month and day when changing filter type
            setSelectedDay(null);
            setFilterValue("2024"); // Reset to 2024
            setDaysInMonth([]); // Reset days in month
          }}
        >
          <option value="tahun">Per Tahun</option>
          <option value="bulan">Per Bulan</option>
        </select>

        {filterType === "tahun" && (
          <select
            className="border"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="2020">2020-2024</option>
          </select>
        )}

        {filterType === "bulan" && (
          <>
            <select
              className="border"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>

            <select
              className="border"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value={null}>Pilih Bulan</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {`Bulan ${i + 1}`}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="w-[100%] h-[400px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BarangKeluarChart;
