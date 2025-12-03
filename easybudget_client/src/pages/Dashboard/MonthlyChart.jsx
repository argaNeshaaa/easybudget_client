import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../../api/axios";

export default function MonthlyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Format Sumbu Y (Singkat: 1jt, 500rb)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(0)}jt`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}rb`;
    return tickItem;
  };

  // Format Tooltip (Lengkap: Rp 1.000.000)
  const formatTooltip = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await api.get("/transactions/summary/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = res.data.data;

        // 1. Template Bulan (Jan - Des)
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // 2. Mapping Data
        // Kita buat array kosong berisi 12 bulan, lalu isi datanya jika ada di API
        const processedData = months.map((monthName, index) => {
          // MySQL month_index mulai dari 1 (Jan), sedangkan array index mulai dari 0.
          // Jadi kita cari data dimana month_index == index + 1
          const monthIndexDB = index + 1;

          const incomeData = rawData.find(d => d.month_index === monthIndexDB && d.type === 'income');
          const expenseData = rawData.find(d => d.month_index === monthIndexDB && d.type === 'expense');

          return {
            name: monthName,
            Income: incomeData ? Number(incomeData.total) : 0,
            Expense: expenseData ? Number(expenseData.total) : 0,
          };
        });

        setData(processedData);
      } catch (err) {
        console.error("Gagal load grafik bulanan:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMonthlyData();
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading Chart...</div>;

  return (
    <div className="w-full h-full">
      <div className="mb-4 px-2">
        <h2 className="text-xl font-bold text-gray-800">Statistik Tahunan</h2>
      </div>

      <div className="h-[22rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
            />
            
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              formatter={(value) => formatTooltip(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            
            {/* BATANG PEMASUKAN (HIJAU) */}
            <Bar 
              dataKey="Income" 
              name="Pemasukan"
              fill="#22c55e" 
              radius={[4, 4, 0, 0]} 
              barSize={10} 
            />
            
            {/* BATANG PENGELUARAN (MERAH) */}
            <Bar 
              dataKey="Expense" 
              name="Pengeluaran"
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={10} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}