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
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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

        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const processedData = months.map((monthName, index) => {
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
            // UBAH DISINI: Margin right dikurangi jadi 10, Left 0 agar nempel ke YAxis width
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              // Perkecil font jadi 10/11 agar 12 bulan muat di layar HP
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              dy={10}
              interval={0} // Memaksa semua label bulan muncul (hati-hati jika layar terlalu kecil)
            />
            
            <YAxis 
              // UBAH DISINI: Fix width 35px agar grafik melebar ke kiri
              width={35}
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
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
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
            />
            
            {/* Batang Pemasukan */}
            <Bar 
              dataKey="Income" 
              name="Pemasukan"
              fill="#22c55e" 
              radius={[4, 4, 0, 0]} 
              // Ubah ukuran bar jika perlu, tapi 8-10px biasanya pas untuk 12 bulan
              barSize={8} 
            />
            
            {/* Batang Pengeluaran */}
            <Bar 
              dataKey="Expense" 
              name="Pengeluaran"
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={8} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}