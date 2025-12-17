import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Download, Wallet, Calendar, TrendingUp } from "lucide-react";
import api from "../../api/axios";
import "../../assets/styles/global.css";
import { useTheme } from "../../context/ThemeContext";
export default function FinancialReports() {
    const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ cash_flow: { income: 0, expense: 0 }, net_worth: 0, avg_daily_expense: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const axisColor = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const gridlineColor = theme === "dark" ? "#e5e7eb" : "#6B7280";
  // Filter State
  const date = new Date();
  const [filters, setFilters] = useState({
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    type: 'expense' 
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // --- HELPERS ---
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatCompact = (num) => {
    return new Intl.NumberFormat("id-ID", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "IDR"
    }).format(num);
  };

  // Warna Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // --- API CALLS ---
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resSummary, resMonthly, resCategory] = await Promise.all([
        api.get("/reports/summary", { 
            headers: { Authorization: `Bearer ${token}` },
            params: { month: filters.month, year: filters.year } 
        }),
        api.get("/reports/monthly", { 
            headers: { Authorization: `Bearer ${token}` },
            params: { year: filters.year } 
        }),
        api.get("/reports/category", { 
            headers: { Authorization: `Bearer ${token}` },
            params: { month: filters.month, year: filters.year, type: filters.type } 
        })
      ]);

      setSummary(resSummary.data.data);
      setMonthlyData(resMonthly.data.data);
      setCategoryData(resCategory.data.data);

    } catch (err) {
      console.error("Gagal load report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]); 

  // Handler Export
  const handleExport = async () => {
    try {
      const response = await api.get("/reports/export", {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: filters.month, year: filters.year },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Keuangan_${filters.year}_${filters.month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Gagal export:", err);
      alert("Gagal mendownload laporan.");
    }
  };

  // Data Transformation
  const pieChartData = categoryData.map(item => ({
    name: item.category_name,
    value: Number(item.total_amount)
  }));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const barChartData = monthlyData.map(item => ({
    ...item,
    name: monthNames[item.month - 1],
    Income: Number(item.total_income),
    Expense: Number(item.total_expense)
  }));

  return (
    <div className="h-screen w-screen font-gabarito overflow-hidden flex flex-col">
      <Sidebar />
      <Header />

      {/* --- CONTENT CONTAINER (Scrollable) --- */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 overflow-y-auto bg-background dark:bg-background-dark z-0">
        
        {/* Wrapper Konten */}
        <main className="p-4 pt-6 pb-32 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
            
            {/* HEADER & FILTER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text-black dark:text-text-white">Financial Report</h1>
                <p className="text-text-grey dark:text-text-grey-dark text-sm md:text-base mt-1">Analisis mendalam kesehatan keuanganmu.</p>
              </div>
              
              <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 bg-background-box dark:bg-background-box-dark p-2 rounded-xl border border-border dark:border-border-dark">
                <div className="flex gap-2">
                    {/* Year Selector */}
                    <select 
                        className="bg-transparent font-semibold text-text-black dark:text-text-white outline-none cursor-pointer px-2 py-1 text-sm md:text-base"
                        value={filters.year}
                        onChange={(e) => setFilters({...filters, year: e.target.value})}
                    >
                        <option value="2024" className="text-text-black">2024</option>
                        <option value="2025" className="text-text-black">2025</option>
                    </select>
                    
                    <div className="w-[1px] bg-gray-300 h-6 self-center"></div>

                    {/* Month Selector */}
                    <select 
                        className="bg-transparent font-semibold text-text-black dark:text-text-white outline-none cursor-pointer px-2 py-1 text-sm md:text-base"
                        value={filters.month}
                        onChange={(e) => setFilters({...filters, month: e.target.value})}
                    >
                        {monthNames.map((m, i) => <option className="text-text-black" key={i} value={i+1}>{m}</option>)}
                    </select>
                </div>
                
                <button 
                    onClick={handleExport}
                    className="ml-2 bg-white hover:bg-gray-100 p-2 rounded-lg text-blue-600 transition shadow-sm border border-gray-200" 
                    title="Export Report"
                >
                    <Download size={18} />
                </button>
              </div>
            </div>

            {/* EXECUTIVE SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Net Worth */}
                <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Wallet size={20}/></div>
                        <span className="text-text-grey dark:text-text-grey-dark font-medium text-sm">Total Kekayaan Bersih</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-black dark:text-text-white">{formatRupiah(summary.net_worth)}</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                        <TrendingUp size={12}/> Aset Likuid (Wallet)
                    </p>
                </div>

                {/* Cash Flow */}
                <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                        <span className="text-text-grey dark:text-text-grey-dark font-medium text-sm">Arus Kas (Bulan Ini)</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-black dark:text-text-white">
                        {formatRupiah(Number(summary.cash_flow.income) - Number(summary.cash_flow.expense))}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 truncate">
                        In: <span className="text-green-600 font-medium">{formatCompact(summary.cash_flow.income)}</span> • 
                        Out: <span className="text-red-600 font-medium">{formatCompact(summary.cash_flow.expense)}</span>
                    </p>
                </div>

                {/* Avg Daily */}
                <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calendar size={20}/></div>
                        <span className="text-text-grey dark:text-text-grey-dark font-medium text-sm">Rata-rata Keluar/Hari</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-black dark:text-text-white">{formatRupiah(summary.avg_daily_expense)}</h3>
                    <p className="text-xs text-gray-400 mt-2">
                        Berdasarkan data bulan ini
                    </p>
                </div>
            </div>

            {/* MAIN CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* GRAFIK TREN TAHUNAN (Bar Chart) */}
                <div className="lg:col-span-2 bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark flex flex-col h-[350px] lg:h-[28rem]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-black dark:text-text-white">Tren Pemasukan vs Pengeluaran</h3>
                        <span className="text-xs text-gray-400 bg-background-box dark:bg-background-box-dark px-2 py-1 rounded">Tahun {filters.year}</span>
                    </div>
                    
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridlineColor} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 11}} dy={10} interval={0} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 11}} tickFormatter={(val) => formatCompact(val)} />
                                <Tooltip 
                                    formatter={(value) => formatRupiah(value)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                />
                                <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px', fontSize: '12px'}} />
                                <Bar dataKey="Income" name="Masuk" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="Expense" name="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAFIK KATEGORI (Pie Chart) */}
                <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark flex flex-col h-[350px] lg:h-[28rem]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-text-black dark:text-text-white">Alokasi Dana</h3>
                        <div className="flex bg-background-box dark:bg-background-box-dark p-1 rounded-lg text-xs font-medium">
                            <button 
                                onClick={() => setFilters({...filters, type: 'expense'})}
                                className={`px-2 py-1 rounded-md transition ${filters.type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                            >
                                Out
                            </button>
                            <button 
                                onClick={() => setFilters({...filters, type: 'income'})}
                                className={`px-2 py-1 rounded-md transition ${filters.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                            >
                                In
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0 relative">
                            {pieChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="  center" wrapperStyle={{fontSize: '11px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-text-grey dark:text-text-grey-dark text-sm text-center px-4">
                                    Belum ada transaksi {filters.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} di bulan ini.
                                </div>
                            )}
                            
                            {/* Center Label */}
                            {pieChartData.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <div className="text-center">
                                    <p className="text-xs text-text-grey dark:text-text-grey-dark uppercase">Total</p>
                                    <p className="text-sm font-bold text-text-black dark:text-text-white">
                                        {formatCompact(pieChartData.reduce((sum, item) => sum + item.value, 0))}
                                    </p>
                                </div>
                            </div>
                            )}
                    </div>
                </div>
            </div>

            {/* BOTTOM TABLE: TOP CATEGORIES LIST */}
            <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-text-black dark:text-text-white mb-4">Rincian Kategori ({monthNames[filters.month - 1]})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className=" text-text-grey dark:text-text-grey-dark uppercase text-xs">
                            <tr>
                                <th className="p-3 rounded-l-lg">Kategori</th>
                                <th className="p-3 text-right">Jml Transaksi</th>
                                <th className="p-3 text-right rounded-r-lg">Total Nominal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categoryData.length > 0 ? categoryData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-background-box dark:hover:bg-background-box-dark transition">
                                    <td className="p-3 font-medium text-text-black dark:text-text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                                        <span className="truncate">{item.category_name}</span>
                                    </td>
                                    <td className="p-3 text-right text-text-black dark:text-text-white">-</td> 
                                    <td className="p-3 text-right font-bold text-text-black dark:text-text-white">{formatRupiah(item.total_amount)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" className="p-4 text-center text-gray-400">Tidak ada data.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
      </div>
    </div>
  );
}