import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";
import "../../assets/styles/global.css";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Untuk dropdown saat tambah budget
  
  // State Modal Tambah
  const [showAdd, setShowAdd] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category_id: "",
    amount: "",
    period_start: "",
    period_end: ""
  });

  // State Modal Edit
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token");

  // --- HELPER ---
  const getUserIdFromToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).user_id;
    } catch (e) { return null; }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getBarColor = (percent) => {
    if (percent <= 50) return "bg-green-500";
    if (percent <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const categoryIcons = {
    "Makanan/Minuman": { icon: "🍔", color: "bg-orange-500" },
    "Pakaian": { icon: "👕", color: "bg-blue-500" },
    "Bensin": { icon: "⛽", color: "bg-red-500" },
    "Kesehatan": { icon: "🏥", color: "bg-green-500" },
    "Hiburan": { icon: "🎬", color: "bg-purple-500" },
    "Transportasi": { icon: "🚗", color: "bg-indigo-500" },
    "Belanja": { icon: "🛍️", color: "bg-pink-500" },
    // Default fallback
    "Default": { icon: "💰", color: "bg-gray-400" }
  };

  // --- API CALLS ---
  const fetchBudgets = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) return;

    try {
      setLoading(true);
      // Panggil 2 API: Get Budgets & Get Categories (untuk dropdown)
      const [resBudgets, resCategories] = await Promise.all([
        api.get(`/budgets/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/categories/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setBudgets(resBudgets.data.data);
      // Filter kategori hanya tipe 'expense'
      setCategories(resCategories.data.data.filter(c => c.type === 'expense'));
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBudgets();
  }, [token]);

  // --- HANDLERS ---
  const handleAdd = async () => {
    if (!newBudget.category_id || !newBudget.amount) {
        alert("Mohon lengkapi data");
        return;
    }

    try {
        // Set default tanggal bulan ini jika kosong
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

        const payload = {
            category_id: newBudget.category_id,
            amount: newBudget.amount.replace(/\./g, ""), // Hapus titik format
            period_start: newBudget.period_start || firstDay,
            period_end: newBudget.period_end || lastDay
        };

        await api.post("/budgets", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchBudgets();
        setShowAdd(false);
        setNewBudget({ category_id: "", amount: "", period_start: "", period_end: "" });
    } catch (err) {
        alert(err.response?.data?.message || "Gagal menambah budget");
    }
  };

  const handleUpdate = async () => {
    try {
        const cleanAmount = editData.limit.toString().replace(/\./g, "");
        
        await api.patch(`/budgets/${editData.id}`, {
            amount: cleanAmount
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchBudgets();
        setEditData(null);
    } catch (err) {
        alert("Gagal update budget");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus budget ini?")) {
        try {
            await api.delete(`/budgets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBudgets();
        } catch (err) {
            alert("Gagal menghapus budget");
        }
    }
  };

  // Setup tanggal header
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <div className="min-h-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] p-8 overflow-y-auto rounded-lg">
        <div className="relative bg-white w-full p-8 rounded-2xl shadow-lg min-h-[80vh]">

          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Budget Planning</h1>
              <p className="text-gray-500 text-lg mt-1">
                Periode {currentMonth} {currentYear}
              </p>
            </div>
            
            {/* Tombol Tambah */}
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-semibold"
            >
              <Plus size={20} />
              Tambah Budget
            </button>
          </div>

          {/* List Budget */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">Belum ada budget bulan ini.</p>
                <button onClick={() => setShowAdd(true)} className="text-blue-600 font-semibold mt-2 hover:underline">
                    Buat sekarang
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 pb-24">
              {budgets.map((item) => {
                // Mapping data dari backend ke variable frontend
                const budgetId = item.budget_id;
                const categoryName = item.category_name;
                const limit = Number(item.limit_amount);
                const spent = Number(item.used_amount);
                
                const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const safePercent = percent > 100 ? 100 : percent; // Bar mentok di 100%
                const barColor = getBarColor(percent);

                // Cari icon, kalau tidak ada pakai default
                const catStyle = Object.keys(categoryIcons).find(key => categoryName.includes(key)) 
                                ? categoryIcons[Object.keys(categoryIcons).find(key => categoryName.includes(key))]
                                : categoryIcons["Default"];

                return (
                  <div
                    key={budgetId}
                    className="p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white flex items-center gap-6 group relative"
                  >
                    {/* Icon Kategori */}
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full text-2xl shadow-inner ${catStyle.color} bg-opacity-90`}>
                      {catStyle.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-bold text-gray-800">{categoryName}</h2>
                        {/* Tombol Hapus (Muncul saat hover) */}
                        <button 
                            onClick={() => handleDelete(budgetId)}
                            className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            title="Hapus Budget"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="relative flex-1 h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${safePercent}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold min-w-[3rem] text-right ${percent > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                            {percent}%
                        </span>
                      </div>

                      {/* Info Nominal */}
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500">
                            Terpakai: <span className={percent > 100 ? "text-red-600 font-bold" : "text-gray-800 font-medium"}>{formatRupiah(spent)}</span>
                        </span>
                        <span className="text-gray-500">
                            Limit: <span className="text-gray-800 font-bold">{formatRupiah(limit)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tombol Edit */}
                    <button
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-semibold border border-blue-100"
                      onClick={() => setEditData({ id: budgetId, name: categoryName, limit: formatNumber(limit) })}
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[28rem] rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Budget</h2>

            <label className="block mb-2 text-gray-600 font-medium text-sm">Kategori</label>
            <input
              className="w-full p-4 border border-gray-200 rounded-xl mb-5 text-gray-500 bg-gray-50 cursor-not-allowed font-medium"
              value={editData.name}
              disabled
              readOnly
            />

            <label className="block mb-2 text-gray-600 font-medium text-sm">Batas Bulanan (Rp)</label>
            <div className="mb-8">
              <div className="flex items-center border border-gray-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden bg-white transition">
                <div className="bg-gray-50 text-gray-500 px-4 py-3 font-semibold border-r border-gray-200">Rp</div>
                <input
                  type="text"
                  placeholder="0"
                  className="w-full p-3 outline-none text-gray-800 font-bold text-lg" 
                  value={editData.limit}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^0-9]/g, "");
                    const formattedValue = numericValue ? formatNumber(numericValue) : "";
                    setEditData({ ...editData, limit: formattedValue });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                onClick={() => setEditData(null)}
              >
                Batal
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                onClick={handleUpdate}
              >
                <Save size={18} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH --- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[28rem] rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Tambah Budget Baru
            </h2>

            {/* Dropdown Kategori */}
            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2 text-sm">Kategori Pengeluaran</label>
              <div className="relative">
                <select
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:outline-none appearance-none text-gray-800 font-medium cursor-pointer"
                    value={newBudget.category_id}
                    onChange={(e) => setNewBudget({ ...newBudget, category_id: e.target.value })}
                >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    ▼
                </div>
              </div>
            </div>

            {/* Input Nominal */}
            <div className="mb-8">
              <label className="block text-gray-600 font-medium mb-2 text-sm">
                Batas Maksimal (Rp)
              </label>
              
              <div className="flex items-center border border-gray-300 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden bg-white transition">
                <div className="bg-gray-50 text-gray-500 px-4 py-3 font-semibold border-r border-gray-200">Rp</div>
                <input
                  type="text" 
                  placeholder="0"
                  className="w-full p-3 outline-none text-gray-800 font-bold text-lg"
                  value={newBudget.amount}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^0-9]/g, "");
                    const formattedValue = numericValue ? formatNumber(numericValue) : "";
                    setNewBudget({ ...newBudget, amount: formattedValue });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                onClick={() => {
                  setShowAdd(false);
                  setNewBudget({ category_id: "", amount: "", period_start: "", period_end: "" });
                }}
              >
                Batal
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                onClick={handleAdd}
              >
                <Plus size={18} /> Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}