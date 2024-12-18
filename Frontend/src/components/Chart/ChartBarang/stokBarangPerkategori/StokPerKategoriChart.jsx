import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StokPerKategoriChart = () => {
  const [chartData, setChartData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5000/api/barang/all');
      const data = response.data.barang;

      // Kelompokkan stok berdasarkan kategori
      const groupedData = data.reduce((acc, item) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + item.stok;
        return acc;
      }, {});

      const labels = Object.keys(groupedData);
      const values = Object.values(groupedData);

      // Set data untuk Chart.js
      setChartData({
        labels,
        datasets: [
          {
            label: 'Stok Barang per Kategori',
            data: values,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return chartData ? (
    <div className='w-1/3'>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default StokPerKategoriChart;

