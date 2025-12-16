import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, ShoppingCart, ClipboardList, Minus } from "lucide-react";
import api from "../../api/axios";

export default function DashboardCards() {
  const [statsData, setStatsData] = useState({
    income: 0,
    incomePrev: 0,
    expense: 0,
    expensePrev: 0,
    countIncome: 0,
    countExpense: 0,
    walletBalance: 0
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      const now = new Date();
      const currentM = now.getMonth() + 1;
      const currentY = now.getFullYear();

      let prevM = currentM - 1;
      let prevY = currentY;
      if (prevM === 0) {
        prevM = 12;
        prevY = currentY - 1;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        const [resIncCurr, resIncPrev, resExpCurr, resExpPrev, resWallet] = await Promise.all([
          api.get("/transactions/total/amount", { ...config, params: { type: "income", month: currentM, year: currentY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "income", month: prevM, year: prevY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "expense", month: currentM, year: currentY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "expense", month: prevM, year: prevY } }),
          api.get("/wallets/total/balance", config)
        ]);

        setStatsData({
          income: Number(resIncCurr.data.data.total_amount) || 0,
          incomePrev: Number(resIncPrev.data.data.total_amount) || 0,
          expense: Number(resExpCurr.data.data.total_amount) || 0,
          expensePrev: Number(resExpPrev.data.data.total_amount) || 0,
          countIncome: Number(resIncCurr.data.data.total_count) || 0,
          countExpense: Number(resExpCurr.data.data.total_count) || 0,
          walletBalance: Number(resWallet.data.data.total_balance) || 0
        });

      } catch (err) {
        console.error("Gagal ambil data cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const incomeTrend = calculateTrend(statsData.income, statsData.incomePrev);
  const expenseTrend = calculateTrend(statsData.expense, statsData.expensePrev);
  const totalTransactions = statsData.countIncome + statsData.countExpense;

  const stats = [
    {
      title: "Total Saldo",
      value: statsData.walletBalance,
      formatted: loading ? "..." : formatRupiah(statsData.walletBalance),
      icon: <Wallet size={24} className="text-white" />, // Ukuran icon disesuaikan sedikit
      subtitle: "Total aset saat ini",
      iconBg: "bg-gradient-to-r from-blue-400 to-blue-600",
      // Mobile: Full Width (col-span-2), Desktop: 1 col
      gridClass: "col-span-2 sm:col-span-2 lg:col-span-1", 
    },
    {
      title: "Pemasukan",
      value: statsData.income,
      formatted: loading ? "..." : formatRupiah(statsData.income),
      icon: <TrendingUp size={24} className="text-white" />,
      trendValue: `${incomeTrend > 0 ? "+" : ""}${incomeTrend.toFixed(1)}%`,
      trendIcon: incomeTrend > 0 ? <TrendingUp size={14} /> : incomeTrend < 0 ? <TrendingDown size={14} /> : <Minus size={14} />,
      trendColor: incomeTrend >= 0 ? "text-green-500" : "text-red-500",
      iconBg: "bg-gradient-to-r from-green-400 to-green-600",
      // Mobile: Half Width (col-span-1), Desktop: 1 col
      gridClass: "col-span-1 sm:col-span-1 lg:col-span-1", 
    },
    {
      title: "Pengeluaran",
      value: statsData.expense,
      formatted: loading ? "..." : formatRupiah(statsData.expense),
      icon: <TrendingDown size={24} className="text-white" />,
      trendValue: `${expenseTrend > 0 ? "+" : ""}${expenseTrend.toFixed(1)}%`,
      trendIcon: expenseTrend > 0 ? <TrendingUp size={14} /> : expenseTrend < 0 ? <TrendingDown size={14} /> : <Minus size={14} />,
      trendColor: expenseTrend <= 0 ? "text-green-500" : "text-red-500",
      iconBg: "bg-gradient-to-r from-red-400 to-red-600",
      // Mobile: Half Width (col-span-1), Desktop: 1 col
      gridClass: "col-span-1 sm:col-span-1 lg:col-span-1", 
    },
    {
      title: "Total Transaksi",
      value: totalTransactions,
      formatted: loading ? "..." : `${totalTransactions}`,
      icon: <ClipboardList size={24} className="text-white" />,
      subtitle: `${totalTransactions} Transakssi bulan ini`,
      iconBg: "bg-gradient-to-r from-purple-400 to-purple-600",
      // Mobile: Full Width (col-span-2), Desktop: 1 col
      gridClass: "col-span-2 sm:col-span-2 lg:col-span-1", 
    },
  ];

  return (
    // UBAH GRID: Default (Mobile) jadi grid-cols-2 agar bisa kita mainkan col-span nya
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 w-full lg:ml-[1rem] lg:mr-[1rem]">
      {stats.map((item, index) => (
        <div
          key={index}
          // Tambahkan item.gridClass untuk mengatur lebar kartu
          className={`bg-white shadow-md p-4 sm:p-6 rounded-2xl flex justify-between items-start hover:shadow-xl transition-all duration-300 ${item.gridClass}`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-semibold truncate">{item.title}</p>
              {/* Responsive text size: Lebih kecil di HP agar muat */}
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{item.formatted}</h2>
            </div>

            {item.trendValue ? (
              <p className={`flex items-center gap-1 text-xs sm:text-sm mt-2 font-medium ${item.trendColor}`}>
                {item.trendIcon} {item.trendValue}
              </p>
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm mt-2 truncate">{item.subtitle}</p>
            )}
          </div>

          <div className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl ${item.iconBg} flex-shrink-0 ml-2`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}