import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const HargaJualChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data dari backend
        const response = await axios.get('http://localhost:5000/api/barang/all');
        const data = response.data.barang;

        // Siapkan data untuk Chart.js
        const labels = data.map(item => item.namaBarang); // Nama Barang
        const values = data.map(item => item.hargaJual); // Harga Jual

        setChartData({
          labels, // Nama Barang
          datasets: [
            {
              label: 'Harga Jual (Rp)',
              data: values,
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Warna bar
              borderColor: 'rgba(255, 99, 132, 1)', // Warna border
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
    <div>
      <h2>Harga Jual per Barang</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Posisi legend
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Harga Jual (Rp)', // Label Y-Axis
              },
            },
          },
        }}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default HargaJualChart;
