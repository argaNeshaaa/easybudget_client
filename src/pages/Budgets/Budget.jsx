import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import AddBudgetModal from "./AddBudgetModal";
import BudgetCard from "./BudgetCard";
import { Plus, Edit2, Trash2, X, Save, Loader2, Clock, Calendar, CheckCircle, AlertCircle, Wallet, PieChart, TrendingUp  } from "lucide-react";
import api from "../../api/axios";
import "../../assets/styles/global.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter Status (active, upcoming, expired)
  const [filterStatus, setFilterStatus] = useState("active");

  // State Modal
  const [showAdd, setShowAdd] = useState(false);
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

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Format Tanggal (dd MMM yyyy)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
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
    "Default": { icon: "💰", color: "bg-gray-400" }
  };

  // --- API CALLS ---
  const fetchBudgets = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) return;

    try {
      setLoading(true);
      // Panggil API dengan parameter status
      const res = await api.get(`/budgets/users/${userId}`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: { status: filterStatus } 
      });

      setBudgets(res.data.data);
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ulang saat filter berubah
  useEffect(() => {
    if (token) fetchBudgets();
  }, [token, filterStatus]);

  // --- HANDLERS ---
  const handleUpdate = async () => {
    try {
        const cleanAmount = editData.limit.toString().replace(/\./g, "");
        await api.patch(`/budgets/${editData.id}`, { amount: cleanAmount }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Update Budget Berhasil!");
        fetchBudgets();
        setEditData(null);
    } catch (err) {
      toast.error("Gagal update budget");
    }
  };

const handleDelete = (id) => {
    Swal.fire({
        title: "Hapus Budget?",
        text: "Anda yakin ingin menghapus budget ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Merah untuk tombol hapus
        cancelButtonColor: "#3085d6", // Biru untuk batal
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then(async (result) => {
        // Logika hanya jalan jika user klik tombol "Ya, Hapus!"
        if (result.isConfirmed) {
            try {
                // Panggil API Delete
                await api.delete(`/budgets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Tampilkan pesan sukses singkat
                Swal.fire({
                    title: "Terhapus!",
                    text: "Budget berhasil dihapus.",
                    icon: "success",
                    timer: 1500, // Hilang sendiri dalam 1.5 detik
                    showConfirmButton: false
                });

                // Refresh data list budget
                fetchBudgets();

            } catch (err) {
                console.error(err);
                // Tampilkan pesan error jika gagal
                Swal.fire({
                    title: "Gagal!",
                    text: err.response?.data?.message || "Gagal menghapus budget.",
                    icon: "error"
                });
            }
        }
    });
};

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

      {/* --- MODAL TAMBAH (Komponen Terpisah) --- */}
      <AddBudgetModal 
        isOpen={showAdd} 
        onClose={() => setShowAdd(false)} 
        onSuccess={fetchBudgets} 
      />

      {/* --- MODAL EDIT (Inline) --- */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[28rem] rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Budget</h2>
                <button onClick={() => setEditData(null)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <label className="block mb-2 text-gray-600 font-medium text-sm">Kategori</label>
            <input
              className="w-full p-4 border border-gray-200 rounded-xl mb-5 text-gray-500 bg-gray-50 cursor-not-allowed font-medium"
              value={editData.name}
              disabled readOnly
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
              <button className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition" onClick={() => setEditData(null)}>Batal</button>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2" onClick={handleUpdate}><Save size={18} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] p-8 overflow-y-auto rounded-lg">
        <div className="relative bg-white w-full p-8 rounded-2xl shadow-lg min-h-[80vh]">

          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Budget Planning</h1>
              <p className="text-gray-500 text-lg mt-1">
                Kelola target pengeluaranmu agar tetap hemat.
              </p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-semibold"
            >
              <Plus size={20} />
              Tambah Budget
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {[
                { key: 'active', label: 'Sedang Berjalan', icon: <Clock size={16}/> },
                { key: 'upcoming', label: 'Akan Datang', icon: <Calendar size={16}/> },
                { key: 'expired', label: 'Selesai / Lewat', icon: <CheckCircle size={16}/> }
            ].map(tab => (
                <button 
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-all whitespace-nowrap ${
                        filterStatus === tab.key 
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
          </div>

          {/* List Budget */}
          {loading ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                <Loader2 className="animate-spin" size={32}/>
                Loading budgets...
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg mb-2">Tidak ada budget dengan status <b>"{filterStatus}"</b>.</p>
                {filterStatus === 'active' && (
                    <button onClick={() => setShowAdd(true)} className="text-blue-600 font-semibold hover:underline">
                        Buat budget baru sekarang
                    </button>
                )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
              {budgets.map((item) => {
                const budgetId = item.budget_id;
                const categoryName = item.category_name;
                const limit = Number(item.limit_amount);
                const spent = Number(item.used_amount);
                
                const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const safePercent = percent > 100 ? 100 : percent; 
                const barColor = filterStatus === 'upcoming' ? 'bg-blue-200' : getBarColor(percent); // Abu-abu jika belum mulai

                const catStyle = Object.keys(categoryIcons).find(key => categoryName.includes(key)) 
                                ? categoryIcons[Object.keys(categoryIcons).find(key => categoryName.includes(key))]
                                : categoryIcons["Default"];

                return (
                  <div
                    key={budgetId}
                    className={`p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between group relative ${filterStatus === 'expired' ? 'opacity-75 grayscale-[0.3]' : ''}`}
                  >
                    <div>
                        {/* Header Kartu */}
                        <div className="flex justify-between items-start mb-4">
                             {/* Badge Tanggal */}
                             <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                <Calendar size={12} />
                                <span>{formatDate(item.period_start)} - {formatDate(item.period_end)}</span>
                             </div>
                             
                             <button 
                                onClick={() => handleDelete(budgetId)}
                                className="p-1.5 text-black hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                title="Hapus Budget"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl shadow-inner ${catStyle.color} bg-opacity-90 text-white`}>
                                {catStyle.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{categoryName}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {filterStatus === 'active' ? 'Sedang Berjalan' : filterStatus === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className={`font-bold ${percent > 100 ? 'text-red-600' : 'text-gray-700'}`}>{percent}%</span>
                                <span className="text-gray-400 text-xs">Terpakai</span>
                            </div>
                            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
                                    style={{ width: `${safePercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Info Nominal */}
                        <div className="flex justify-between items-end text-sm mt-3 pt-3 border-t border-gray-50">
                            <div>
                                <p className="text-xs text-gray-400">Terpakai</p>
                                <p className={`font-semibold ${percent > 100 ? "text-red-600" : "text-gray-800"}`}>{formatRupiah(spent)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Limit</p>
                                <p className="font-bold text-gray-800">{formatRupiah(limit)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Edit (Hanya jika belum expired) */}
                    {filterStatus !== 'expired' && (
                        <button
                        className="w-full mt-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition font-medium border border-gray-100 text-sm flex items-center justify-center gap-2"
                        onClick={() => setEditData({ id: budgetId, name: categoryName, limit: formatNumber(limit) })}
                        >
                        <Edit2 size={14}/> Edit Limit
                        </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}