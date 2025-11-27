import { TrendingUp, TrendingDown, Wallet, ShoppingCart, ClipboardList } from "lucide-react";

export default function DashboardCards() {

  // dummy data sementara — nanti replace dari API
  const stats = [
    {
      title: "Total Pemasukan",
      value: 0,
      formatted: `Rp 0`,
      icon: <Wallet size={28} className="text-white" />,
      trendValue: "+0.0% dari bulan lalu",
      trendIcon: <TrendingUp size={18} />,
      trendColor: "text-green-500",
      iconBg: "bg-gradient-to-r from-green-400 to-green-600",
    },
    {
      title: "Total Pengeluaran",
      value: 0,
      formatted: `Rp 0`,
      icon: <ShoppingCart size={28} className="text-white" />,
      trendValue: "+0.0% dari bulan lalu",
      trendIcon: <TrendingDown size={18} />,
      trendColor: "text-red-500",
      iconBg: "bg-gradient-to-r from-red-400 to-red-600",
    },
    {
      title: "Saldo",
      value: 0,
      formatted: `Rp 0`,
      icon: <Wallet size={28} className="text-white" />,
      subtitle: "Wallet",
      iconBg: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      title: "Total Transaksi",
      value: 0,
      formatted: `0`,
      icon: <ClipboardList size={28} className="text-white" />,
      subtitle: "0 bulan ini",
      iconBg: "bg-gradient-to-r from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full ml-[1rem] mr-[1rem]">
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
