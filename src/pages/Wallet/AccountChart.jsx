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
import { useTheme } from "../../context/ThemeContext";

export default function AccountChart({ accountId }) {
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const axisColor = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const gridlineColor = theme === "dark" ? "#e5e7eb" : "#6B7280";
  // Format Rupiah Singkat (Sumbu Y)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}jt`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}rb`;
    return tickItem;
  };

  // Format Tooltip Lengkap
  const formatTooltip = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchAccountStats = async () => {
      if (!accountId || !token) return;

      try {
        setLoading(true);
        const res = await api.get(`/transactions/account/${accountId}/monthly-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // === MULAI PERBAIKAN: TRANSFORMASI DATA ===
        const rawData = res.data.data || [];

        // 1. Cari tahu berapa hari dalam bulan ini (untuk sumbu X yang rapi)
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        const formattedData = [];

        // 2. Loop dari tanggal 1 sampai tanggal terakhir bulan ini
        for (let i = 1; i <= daysInMonth; i++) {
          // Cari data income untuk tanggal 'i'
          const incomeItem = rawData.find(d => d.day === i && d.type === 'income');
          // Cari data expense untuk tanggal 'i'
          const expenseItem = rawData.find(d => d.day === i && d.type === 'expense');

          // 3. Susun objek baru sesuai kemauan Recharts
          formattedData.push({
            name: i.toString(), // Sumbu X
            Income: incomeItem ? Number(incomeItem.total) : 0,  // Cocokkan dengan dataKey="Income"
            Expense: expenseItem ? Number(expenseItem.total) : 0 // Cocokkan dengan dataKey="Expense"
          });
        }
        
        console.log("Data setelah diformat:", formattedData); // Cek console untuk memastikan
        setData(formattedData);
        // === SELESAI PERBAIKAN ===

      } catch (err) {
        console.error("Gagal load chart akun:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStats();
  }, [accountId, token]);

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading Chart...</div>;
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data transaksi bulan ini.</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        // Margin ditambah di bawah (bottom: 20) untuk label tanggal jika diputar
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }} 
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
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridlineColor} />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          // interval={0} Memaksa SEMUA tanggal muncul
          interval={0} 
          // angle={-45} Memutar teks agar tidak bertumpuk
          // textAnchor="end" Posisi teks menyesuaikan putaran
          tick={{ fill: axisColor, fontSize: 11 }} 
          dy={10}
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={formatYAxis} 
          tick={{ fill: axisColor, fontSize: 11 }} 
          width={35} // Lebar axis kiri disempitkan agar grafik makin lebar
        />
        
        <Tooltip 
          formatter={(value) => formatTooltip(value)}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
        
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
  );
}