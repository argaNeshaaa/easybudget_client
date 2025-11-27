import React, { useState } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import "../../assets/styles/global.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Wallet, Plus, MoreHorizontal, ChevronLeft, X } from "lucide-react";

const chartData = [
  { name: "Jan", tabungan: 500000 },
  { name: "Feb", tabungan: 1200000 },
  { name: "Mar", tabungan: 900000 },
  { name: "Apr", tabungan: 1800000 },
  { name: "May", tabungan: 2400000 },
  { name: "Jun", tabungan: 2000000 },
];

const goalsDataInitial = [
  { id: 1, title: "PC Gaming", current: 3000000, target: 6000000, deadline: "Sep, 2025" },
  { id: 2, title: "Motor", current: 10000000, target: 20000000, deadline: "Sep, 2025" },
  { id: 3, title: "Top up Game", current: 500000, target: 1000000, deadline: "Sep, 2025" },
  { id: 4, title: "Jalan Jalan", current: 1000000, target: 2000000, deadline: "Sep, 2025" },
  { id: 5, title: "Beli Game", current: 500000, target: 1000000, deadline: "Sep, 2025" },
];

// Gauge (half donut) data
const gaugeData = [
  { name: "Tercapai", value: 500000 },
  { name: "Sisa", value: 500000 }, // contoh: total target bulan ini 1jt
];
const GAUGE_COLORS = ["#14b8a6", "#e2e8f0"]; // teal & light gray

function Goal() {
  const [viewMode, setViewMode] = useState("dashboard"); // 'dashboard' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalsData, setGoalsData] = useState(goalsDataInitial);
  const [formData, setFormData] = useState({ name: "", collected: "", target: "", deadline: "" });

  // Format currency (IDR)
  const formatRupiah = (number) => {
    if (typeof number !== "number") return number;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // calculate progress in percent (0..100)
  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // handle add goal (local demo)
  const handleAddGoal = () => {
    const nextId = goalsData.length ? Math.max(...goalsData.map((g) => g.id)) + 1 : 1;
    const parsedTarget = Number(String(formData.target).replace(/\D/g, "")) || 0;
    const parsedCollected = Number(String(formData.collected).replace(/\D/g, "")) || 0;

    const newGoal = {
      id: nextId,
      title: formData.name || "Untitled",
      current: parsedCollected,
      target: parsedTarget,
      deadline: formData.deadline || "TBD",
    };
    setGoalsData((prev) => [newGoal, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: "", collected: "", target: "", deadline: "" });
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-6 z-10">
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
            <p className="text-sm text-gray-500">
              Selamat datang! {/* kamu bisa ubah nama dinamis */}
            </p>
          </div>

          {viewMode === "dashboard" ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Left: charts and stats */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                {/* Row: Tabungan & Target Gauge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="z-10">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
                        <Wallet size={20} />
                      </div>
                      <h3 className="text-gray-500 font-medium">Tabungan</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">Rp 2.000.000</p>
                      <p className="text-xs text-gray-400 mt-1">Total Tabungan</p>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-teal-50 rounded-full opacity-50"></div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">Target</h3>
                      <span className="text-xs text-gray-400">Nov, 2025</span>
                    </div>

                    <div className="flex items-center w-full justify-between">
                      <div className="flex flex-col gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Target Tercapai</p>
                          <p className="font-bold text-gray-800">Rp 500.000</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Target Bulan INI</p>
                          <p className="font-bold text-gray-800">Rp 1.000.000</p>
                        </div>
                      </div>

                      {/* Gauge (half donut) */}
                      <div className="w-36 h-36 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={gaugeData}
                              cx="50%"
                              cy="50%"
                              startAngle={180}
                              endAngle={0}
                              innerRadius={35}
                              outerRadius={55}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              {gaugeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute top-[45%] text-center -translate-y-1/2">
                          <span className="text-lg font-bold block">500k</span>
                          <span className="text-[10px] text-gray-400">Target vs Pencapaian</span>
                        </div>
                      </div>
                    </div>

                    <button className="bg-teal-600 text-white text-xs py-1 px-4 rounded-full mt-2 hover:bg-teal-700 transition">
                      Ubah Target
                    </button>
                  </div>
                </div>

                {/* Statistik Tabungan (Area Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm h-[22rem] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Statistik Tabungan</h3>
                    <select className="border border-gray-200 text-sm rounded-lg p-1 text-gray-500 bg-transparent outline-none">
                      <option>6 Month</option>
                      <option>1 Year</option>
                    </select>
                  </div>

                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorTabungan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000000}Jt`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value) => formatRupiah(value)}
                        />
                        <Area type="monotone" dataKey="tabungan" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorTabungan)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right: Goals list */}
              <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Target</h3>
                  <button onClick={() => setViewMode("grid")} className="text-sm text-teal-600 font-medium hover:underline">
                    View all
                  </button>
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                  {goalsData.map((goal) => (
                    <div key={goal.id} className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-700">{goal.title}</span>
                        <span className="text-xs font-bold text-gray-500">{calculateProgress(goal.current, goal.target)}%</span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}></div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatRupiah(goal.current)} / {`${goal.target / 1000000}Jt`}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <button onClick={() => setIsModalOpen(true)} className="w-full bg-teal-600 text-white py-3 rounded-xl shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 font-medium">
                    <Plus size={16} /> Tambah
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Grid / View All Mode */
            <div className="flex flex-col h-full">
              <button onClick={() => setViewMode("dashboard")} className="mb-4 flex items-center text-teal-600 gap-2 font-semibold hover:underline w-fit">
                <ChevronLeft size={16} /> Kembali ke Dashboard
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {goalsData.map((goal) => (
                  <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{goal.title}</h3>
                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-700">Target Rp {goal.target / 1000000}Jt</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                      <span>{formatRupiah(goal.current)} / {`${goal.target / 1000000}Jt`}</span>
                      <span>{calculateProgress(goal.current, goal.target)}%</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <div>
                        <p>Tenggat Waktu</p>
                        <p className="text-gray-600 font-medium mt-1">{goal.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p>Remaining</p>
                        <p className="text-gray-600 font-medium mt-1">{formatRupiah(goal.target - goal.current)}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-teal-700">Edit</button>
                    </div>
                  </div>
                ))}

                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:border-teal-500 group transition" onClick={() => setIsModalOpen(true)}>
                  <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-md group-hover:bg-teal-700 transition">Tambah Goals</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddGoal(); }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Goals</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" placeholder="Laptop" className=" text-black placeholder-gray-400 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Terkumpul (angka saja)</label>
                <input value={formData.collected} onChange={(e) => setFormData({ ...formData, collected: e.target.value })} type="text" placeholder="1000000" className="text-black placeholder-gray-400 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target (angka saja)</label>
                <input value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} type="text" placeholder="2000000" className=" text-black placeholder-gray-400 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tenggat Waktu</label>
                <input value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} type="text" placeholder="Sep, 2025" className=" text-black placeholder-gray-400 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-teal-600/10 text-teal-700 font-semibold hover:bg-teal-600/20 transition">Back</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 transition">Tambah</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goal;
