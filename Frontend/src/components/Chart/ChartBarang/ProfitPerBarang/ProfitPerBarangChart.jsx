import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const ProfitPerBarangChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from backend
        const response = await axios.get('http://localhost:5000/api/barang/all');
        const data = response.data.barang;

        // Group data by category and calculate total profit per category
        const profitByCategory = data.reduce((acc, item) => {
          // Calculate profit per item
          const profitPerItem = (item.hargaJual - item.hargaBeli) * item.stok;

          // Add to the existing profit for the category
          if (acc[item.kategori]) {
            acc[item.kategori] += profitPerItem;
          } else {
            acc[item.kategori] = profitPerItem;
          }

          return acc;
        }, {});

        // Prepare chart data
        const labels = Object.keys(profitByCategory); // Categories
        const values = Object.values(profitByCategory); // Total profit per category

        // Predefined colors for each category
        const predefinedColors = [
          '#FF6384', // Color for first category
          '#36A2EB', // Color for second category
          '#FFCE56', // Color for third category
          '#4BC0C0', // Color for fourth category
          '#9966FF', // Color for fifth category
        ];

        // Ensure there are enough colors for the number of categories
        const colors = labels.map((_, index) => predefinedColors[index % predefinedColors.length]);

        // Set chart data
        setChartData({
          labels, // Categories
          datasets: [
            {
              label: 'Keuntungan per Kategori (Rp)',
              data: values,
              backgroundColor: colors, // Use predefined colors
              borderColor: '#fff', // White border for all bars
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return chartData ? (
    <div className='w-1/3'>
      <h2>Keuntungan per Kategori</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ProfitPerBarangChart;
