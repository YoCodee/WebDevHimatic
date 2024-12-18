import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const TrenBarangChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data dari backend
        const response = await axios.get('http://localhost:5000/api/barang/all');
        const data = response.data.barang;

        // Proses data untuk grup berdasarkan tanggal
        const dateCounts = data.reduce((acc, item) => {
          const date = new Date(item.date).toISOString().split('T')[0]; // Ambil tanggal saja
          acc[date] = (acc[date] || 0) + 1; // Hitung jumlah barang per tanggal
          return acc;
        }, {});

        // Ubah data menjadi array untuk Chart.js
        const sortedDates = Object.keys(dateCounts).sort(); // Urutkan berdasarkan tanggal
        const values = sortedDates.map(date => dateCounts[date]); // Jumlah barang per tanggal

        // Siapkan data untuk Chart.js
        setChartData({
          labels: sortedDates, // Tanggal
          datasets: [
            {
              label: 'Penambahan Barang',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)', // Warna garis
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Warna area bawah garis
              tension: 0.3, // Kelengkungan garis
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
    <div className='w-1/2 '>
      <h2>Tren Penambahan Barang</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Posisi legend
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Tanggal', // Label X-Axis
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Jumlah Barang', // Label Y-Axis
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

export default TrenBarangChart;
