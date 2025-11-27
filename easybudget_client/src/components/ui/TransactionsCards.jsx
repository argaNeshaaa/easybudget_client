import { LuWallet, LuArrowDown, LuArrowUp, LuClipboardList } from "react-icons/lu";

export function TransactionsCards() {
  const cards = [
    {
      title: "Total Transaksi",
      value: "0",
      subtitle: "Semua Data",
      icon: <LuClipboardList size={30} className="text-white" />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Pemasukan",
      value: "0",
      subtitle: "Transaksi",
      icon: <LuArrowUp size={30} className="text-white" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pengeluaran",
      value: "0",
      subtitle: "Transaksi",
      icon: <LuArrowDown size={30} className="text-white" />,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Saldo",
      value: "0",
      subtitle: "Wallet",
      icon: <LuWallet size={30} className="text-white" />,
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="w-full px-6 py-6 bg-[#e9edf4] rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card bg-white rounded-2xl shadow-md p-6 flex justify-between items-center transition hover:shadow-xl"
          >
            <div>
              <p className="text-gray-500 font-semibold">{card.title}</p>
              <h2 className="text-3xl font-bold text-gray-900">{card.value}</h2>
              <p className="text-gray-400 text-sm">{card.subtitle}</p>
            </div>

            <div
              className={`w-14 h-14 rounded-xl flex justify-center items-center bg-gradient-to-br ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
