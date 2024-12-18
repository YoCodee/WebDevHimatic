import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarangChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [barangPerKategori, setBarangPerKategori] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/barang/all"); // Endpoint API
        const data = response.data.barang;

        // Mengelompokkan data berdasarkan kategori
        const kategoriCounts = data.reduce((acc, curr) => {
          acc[curr.kategori] = (acc[curr.kategori] || 0) + 1;
          return acc;
        }, {});

        // Memisahkan barang per kategori
        const barangByCategory = data.reduce((acc, curr) => {
          if (!acc[curr.kategori]) acc[curr.kategori] = [];
          acc[curr.kategori].push(curr.namaBarang);
          return acc;
        }, {});

        // Menyiapkan data untuk chart
        const categories = Object.keys(kategoriCounts);
        const counts = Object.values(kategoriCounts);

        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Jumlah Barang",
              data: counts,
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#9966ff",
              ],
              borderColor: "#ccc",
              borderWidth: 1,
            },
          ],
        });

        setCategories(categories);
        setBarangPerKategori(barangByCategory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : (
        <>
          <div className="p-4 bg-white shadow-md rounded-lg">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Barang Berdasarkan Kategori" },
                },
              }}
            />
          </div>

          {/* Additional Notes Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Notes
            </h3>
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${
                    selectedCategory === category ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {selectedCategory && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Barang di kategori:{" "}
                  <span className="text-blue-600 font-semibold">
                    {selectedCategory}
                  </span>
                </h4>
                <ul className="list-disc list-inside text-gray-600">
                  {barangPerKategori[selectedCategory].map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BarangChart;
