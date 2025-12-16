import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";

export default function WeeklyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Helper: Format Rupiah Singkat
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}jt`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}rb`;
    return tickItem;
  };

  // Helper: Format Tooltip
  const formatTooltip = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const res = await api.get("/transactions/summary/weekly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const rawData = res.data.data;
        const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
        
        const processedData = days.map((day, index) => {
          const incomeData = rawData.find(d => d.day_index === index && d.type === 'income');
          const expenseData = rawData.find(d => d.day_index === index && d.type === 'expense');

          return {
            name: day.substring(0, 3), // OPTIONAL: Singkat hari jadi 'Sen', 'Sel' agar muat di mobile
            fullName: day, // Simpan nama penuh untuk tooltip jika perlu
            Income: incomeData ? Number(incomeData.total) : 0,
            Expense: expenseData ? Number(expenseData.total) : 0,
          };
        });

        setData(processedData);
      } catch (err) {
        console.error("Gagal load grafik:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWeeklyData();
  }, [token]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading Chart...</div>;

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-gray-800">Grafik Mingguan</h2>
        {/* Legend */}
        <div className="flex gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Masuk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-gray-600">Keluar</span>
          </div>
        </div>
      </div>

      <div className="h-[22rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            // UBAH DISINI: Kurangi margin right agar grafik lebih lebar
            // Left di 0 berarti dia nempel ke YAxis width
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              // Perkecil font size agar muat banyak hari
              tick={{ fill: '#6b7280', fontSize: 11 }} 
              dy={10}
            />
            
            <YAxis 
              // UBAH DISINI: Paksa lebar axis jadi kecil (35px)
              // Ini kunci agar grafik terlihat "Landscape" (melebar ke kiri)
              width={35}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 11 }} 
              tickFormatter={formatYAxis} 
            />
            
            <Tooltip 
              formatter={(value) => formatTooltip(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            
            <Area
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="Expense"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}