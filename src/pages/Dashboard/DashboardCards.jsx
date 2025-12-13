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
    // Tambahkan state baru untuk Real Wallet Balance
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

        // Tambahkan request ke endpoint wallet di Promise.all
        const [resIncCurr, resIncPrev, resExpCurr, resExpPrev, resWallet] = await Promise.all([
          api.get("/transactions/total/amount", { ...config, params: { type: "income", month: currentM, year: currentY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "income", month: prevM, year: prevY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "expense", month: currentM, year: currentY } }),
          api.get("/transactions/total/amount", { ...config, params: { type: "expense", month: prevM, year: prevY } }),
          // Request Baru: Ambil Total Saldo Wallet
          api.get("/wallets/total/balance", config) 
        ]);

        setStatsData({
          income: Number(resIncCurr.data.data.total_amount) || 0,
          incomePrev: Number(resIncPrev.data.data.total_amount) || 0,
          expense: Number(resExpCurr.data.data.total_amount) || 0,
          expensePrev: Number(resExpPrev.data.data.total_amount) || 0,
          countIncome: Number(resIncCurr.data.data.total_count) || 0,
          countExpense: Number(resExpCurr.data.data.total_count) || 0,
          
          // Simpan data wallet balance
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
  
  // Total Transaksi
  const totalTransactions = statsData.countIncome + statsData.countExpense;

  const stats = [
    {
      title: "Total Pemasukan",
      value: statsData.income,
      formatted: loading ? "..." : formatRupiah(statsData.income),
      icon: <Wallet size={28} className="text-white" />,
      trendValue: `${incomeTrend > 0 ? "+" : ""}${incomeTrend.toFixed(1)}% dari bulan lalu`,
      trendIcon: incomeTrend > 0 ? <TrendingUp size={18} /> : incomeTrend < 0 ? <TrendingDown size={18} /> : <Minus size={18} />,
      trendColor: incomeTrend >= 0 ? "text-green-500" : "text-red-500", 
      iconBg: "bg-gradient-to-r from-green-400 to-green-600",
    },
    {
      title: "Total Pengeluaran",
      value: statsData.expense,
      formatted: loading ? "..." : formatRupiah(statsData.expense),
      icon: <ShoppingCart size={28} className="text-white" />,
      trendValue: `${expenseTrend > 0 ? "+" : ""}${expenseTrend.toFixed(1)}% dari bulan lalu`,
      trendIcon: expenseTrend > 0 ? <TrendingUp size={18} /> : expenseTrend < 0 ? <TrendingDown size={18} /> : <Minus size={18} />,
      trendColor: expenseTrend <= 0 ? "text-green-500" : "text-red-500", 
      iconBg: "bg-gradient-to-r from-red-400 to-red-600",
    },
    {
      title: "Total Saldo (Wallets)",
      // Gunakan data dari Wallet, bukan hitungan income-expense
      value: statsData.walletBalance,
      formatted: loading ? "..." : formatRupiah(statsData.walletBalance),
      icon: <Wallet size={28} className="text-white" />,
      subtitle: "Total aset saat ini",
      iconBg: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      title: "Total Transaksi",
      value: totalTransactions,
      formatted: loading ? "..." : `${totalTransactions}`,
      icon: <ClipboardList size={28} className="text-white" />,
      subtitle: `${totalTransactions} kali bulan ini`,
      iconBg: "bg-gradient-to-r from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 w-full lg:ml-[1rem] lg:mr-[1rem]">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-md p-6 rounded-2xl flex justify-between items-start hover:shadow-xl transition-all duration-300"
        >
          <div>
            <p className="text-gray-500 text-sm font-semibold">{item.title}</p>
            <h2 className="text-3xl font-bold text-gray-900">{item.formatted}</h2>

            {item.trendValue ? (
              <p className={`flex items-center gap-1 text-sm mt-2 font-medium ${item.trendColor}`}>
                {item.trendIcon} {item.trendValue}
              </p>
            ) : (
              <p className="text-gray-400 text-sm mt-2">{item.subtitle}</p>
            )}
          </div>

          <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${item.iconBg}`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}