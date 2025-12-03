import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import api from "../../api/axios";

export default function AccountChart({ accountId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Default false agar tidak flash saat init
  const token = localStorage.getItem("token");

  // Format Rupiah
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}jt`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}rb`;
    return tickItem;
  };

  const formatTooltip = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchAccountStats = async () => {
      // Jika tidak ada accountId (misal data belum load), jangan fetch
      if (!accountId || !token) return;

      try {
        setLoading(true);
        const res = await api.get(`/transactions/account/${accountId}/monthly-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const rawData = res.data.data;

        // --- LOGIC PEMBUATAN DATA CHART ---
        // Kita buat array tanggal 1 sampai hari ini (atau sampai tgl 31)
        // Agar grafik terlihat seperti kalender berjalan
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const chartData = [];

        for (let i = 1; i <= daysInMonth; i++) {
          const dayString = i.toString();
          
          // Cari data di tanggal i
          const income = rawData.find(d => d.day === i && d.type === 'income');
          const expense = rawData.find(d => d.day === i && d.type === 'expense');

          chartData.push({
            name: dayString, // Tanggal 1, 2, 3...
            Income: income ? Number(income.total) : 0,
            Expense: expense ? Number(expense.total) : 0,
          });
        }

        setData(chartData);
      } catch (err) {
        console.error("Gagal load chart akun:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStats();
  }, [accountId, token]); // <--- PENTING: Re-run effect jika accountId berubah

  if (!accountId) return <div className="flex h-full items-center justify-center text-gray-400">Pilih akun untuk melihat grafik</div>;
  
  return (
    <div className="w-full h-full relative">
       {/* Loading Overlay (Optional) */}
       {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600 animate-pulse">Memuat Data...</span>
        </div>
      )}

      <div className="h-[20rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              interval={2} // Tampilkan tanggal loncat-loncat biar tidak penuh
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
            />
            <Tooltip 
              formatter={(value) => formatTooltip(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area
              type="monotone"
              dataKey="Income"
              name="Pemasukan"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorIncAcc)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Expense"
              name="Pengeluaran"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpAcc)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}