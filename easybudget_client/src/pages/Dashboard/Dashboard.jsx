import { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../../components/ui/Navbar";
import DashboardCards from "../../components/ui/DashboardCards";
import "../../assets/styles/global.css";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
function Dashboard() {
  const auth = useAuth();
  const userId = auth?.user_id;
  const token = localStorage.getItem("token");

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transactions = response.data.data;

        const income = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        // Hitung total expense
        const expense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        setTotalIncome(income);
        setTotalExpense(expense);
      } catch (error) {
        console.error("Failed fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [userId, token]);

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito flex">
      <Sidebar />
      <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[147vh] text-white flex items-center justify-start flex-col">
          <div className="w-full h-[15rem] flex flex-between items-center justify-between">
            <DashboardCards />
          </div>
          <div className="w-full h-[35rem] flex flex-between items-center justify-between">
            <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] ml-[1rem] p-6 rounded-xl shadow-md flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Pengeluaran Mingguan</h2>

                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Pengeluaran</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                </div>

                <svg
                  viewBox="0 0 500 250"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="3"
                    points="
                    0,180
                    80,150
                    160,200
                    240,130
                    320,170
                    400,90
                    480,120
                "
                  />

                  <circle cx="0" cy="180" r="5" fill="#ef4444" />
                  <circle cx="80" cy="150" r="5" fill="#ef4444" />
                  <circle cx="160" cy="200" r="5" fill="#ef4444" />
                  <circle cx="240" cy="130" r="5" fill="#ef4444" />
                  <circle cx="320" cy="170" r="5" fill="#ef4444" />
                  <circle cx="400" cy="90" r="5" fill="#ef4444" />
                  <circle cx="480" cy="120" r="5" fill="#ef4444" />
                </svg>

                <div
                  className="absolute bottom-0 left-[3rem] right-0 
    flex justify-between text-gray-600 text-sm mt-2"
                >
                  <span>Senin</span>
                  <span>Selasa</span>
                  <span>Rabu</span>
                  <span>Kamis</span>
                  <span>Jumat</span>
                  <span>Sabtu</span>
                  <span>Minggu</span>
                </div>

                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-gray-600 text-sm">
                  <span>Rp 900k</span>
                  <span>Rp 800k</span>
                  <span>Rp 700k</span>
                  <span>Rp 600k</span>
                  <span>Rp 500k</span>
                  <span>Rp 400k</span>
                  <span>Rp 300k</span>
                  <span>Rp 200k</span>
                  <span>Rp 100k</span>
                  <span>Rp 0</span>
                </div>
              </div>
            </div>
            <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] mr-[1rem]">
              <div className="w-full h-full p-6 flex flex-col">
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-black mb-6">
                  Persentase Bulanan
                </h2>

                {/* DONUT WRAPPER */}
                <div className="flex-1 flex items-center justify-center">
                  <svg
                    width="260"
                    height="260"
                    viewBox="0 0 36 36"
                    className="transform -rotate-90"
                  >
                    {/* Static data: income 60%, expense 40% */}

                    {/* Background ring */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />

                    {/* Income (blue) 60% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="60 40"
                      strokeDashoffset="25"
                    />

                    {/* Expense (red) 40% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="40 60"
                      strokeDashoffset="-35"
                    />
                  </svg>
                </div>

                {/* LEGEND */}
                <div className="flex justify-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-700">Pendapatan (60%)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-700">Pengeluaran (40%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[35rem] flex flex-between items-center justify-center">
            <div className="dashboard-card w-[120rem] h-[30rem] bg-[#ffffff] ml-[1rem] mr-[1rem]">
              <div className="w-full h-full p-6 flex flex-col gap-6">
                {/* Header area: title + date range */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Overview
                    </h3>
                    <p className="text-sm text-gray-500">
                      Summary of transactions & balances
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>This Month</option>
                      <option>Custom</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
                      Export
                    </button>
                  </div>
                </div>

                {/* Top row: totals + mini chart */}
                <div className="flex gap-6">
                  {/* totals */}
                  <div className="flex gap-4">
                    <div className="w-64 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col">
                      <span className="text-sm text-gray-500">
                        Total Pemasukan
                      </span>
                      <span className="text-2xl font-bold text-green-600 mt-2">
                        Rp 12.345.678
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        vs last month +12%
                      </span>
                    </div>

                    <div className="w-64 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col">
                      <span className="text-sm text-gray-500">
                        Total Pengeluaran
                      </span>
                      <span className="text-2xl font-bold text-red-600 mt-2">
                        Rp 8.765.432
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        vs last month -3%
                      </span>
                    </div>

                    <div className="w-64 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col">
                      <span className="text-sm text-gray-500">Balance</span>
                      <span className="text-2xl font-bold text-gray-800 mt-2">
                        Rp 3.580.246
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Available in wallets
                      </span>
                    </div>
                  </div>

                  {/* Chart placeholder (fills remaining space) */}
                  <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Income vs Expense (Chart)
                      </h4>
                      <div className="text-xs text-gray-500">Last 30 days</div>
                    </div>

                    {/* simple SVG line/bar placeholder — replace with chart lib */}
                    <div className="w-full h-40 bg-gradient-to-b from-white to-gray-50 rounded-md flex items-center justify-center">
                      <svg
                        width="90%"
                        height="80%"
                        viewBox="0 0 600 160"
                        xmlns="http://www.w3.org/2000/svg"
                        className="opacity-70"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="600"
                          height="160"
                          fill="transparent"
                        />
                        {/* bars */}
                        <g fill="#dbeafe">
                          <rect
                            x="40"
                            y="40"
                            width="20"
                            height="80"
                            rx="4"
                          ></rect>
                          <rect
                            x="80"
                            y="20"
                            width="20"
                            height="100"
                            rx="4"
                          ></rect>
                          <rect
                            x="120"
                            y="70"
                            width="20"
                            height="50"
                            rx="4"
                          ></rect>
                          <rect
                            x="160"
                            y="10"
                            width="20"
                            height="110"
                            rx="4"
                          ></rect>
                        </g>
                        <g fill="#fee2e2">
                          <rect
                            x="220"
                            y="60"
                            width="20"
                            height="60"
                            rx="4"
                          ></rect>
                          <rect
                            x="260"
                            y="30"
                            width="20"
                            height="90"
                            rx="4"
                          ></rect>
                          <rect
                            x="300"
                            y="90"
                            width="20"
                            height="30"
                            rx="4"
                          ></rect>
                          <rect
                            x="340"
                            y="50"
                            width="20"
                            height="70"
                            rx="4"
                          ></rect>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Middle area: transactions table + sidebar summary */}
                <div className="flex gap-6 flex-1 overflow-hidden">
                  {/* Transactions table (left, wider) */}
                  <div className="flex-1 bg-white rounded-lg shadow-sm p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700">
                        Recent Transactions
                      </h4>
                      <div className="text-xs text-gray-500">
                        Showing 10 latest
                      </div>
                    </div>

                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b">
                          <th className="py-2">Date</th>
                          <th className="py-2">Description</th>
                          <th className="py-2">Category</th>
                          <th className="py-2">Type</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* example rows */}
                        <tr className="border-b">
                          <td className="py-3 text-gray-600">2025-11-26</td>
                          <td className="py-3 text-gray-700">Salary</td>
                          <td className="py-3 text-gray-600">Income</td>
                          <td className="py-3 text-green-600">Income</td>
                          <td className="py-3 text-right text-gray-800 font-semibold">
                            Rp 5.000.000
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 text-gray-600">2025-11-25</td>
                          <td className="py-3 text-gray-700">Groceries</td>
                          <td className="py-3 text-gray-600">Food</td>
                          <td className="py-3 text-red-600">Expense</td>
                          <td className="py-3 text-right text-gray-800">
                            Rp 250.000
                          </td>
                        </tr>
                        {/* render real rows dynamically */}
                      </tbody>
                    </table>
                  </div>

                  {/* Right sidebar summary */}
                  <aside className="w-80 bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Wallet Summary
                      </h5>
                      <p className="text-xs text-gray-500">
                        Total across wallets
                      </p>
                      <div className="mt-3 text-xl font-bold">Rp 3.580.246</div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Top Categories
                      </h5>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li className="flex justify-between">
                          <span>Food</span>
                          <span>Rp 1.200.000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Transport</span>
                          <span>Rp 450.000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Entertainment</span>
                          <span>Rp 300.000</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-md">
                        Add Transaction
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
