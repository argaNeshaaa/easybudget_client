import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import AddBudgetModal from "./AddBudgetModal";
import { Plus, Edit2, Trash2, X, Save, Loader2, Clock, Calendar, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import "../../assets/styles/global.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter Status
  const [filterStatus, setFilterStatus] = useState("active");

  // State Modal
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/budgets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: "Terhapus!",
                    text: "Budget berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchBudgets();
            } catch (err) {
                Swal.fire({
                    title: "Gagal!",
                    text: err.response?.data?.message || "Gagal menghapus budget.",
                    icon: "error"
                });
            }
        }
    });
  };

  return (
    <div className="h-screen w-screen bg-[#F3F4F6] font-gabarito overflow-hidden flex flex-col">
      <Sidebar />
      <Header />

      {/* --- MODAL TAMBAH --- */}
      <AddBudgetModal 
        isOpen={showAdd} 
        onClose={() => setShowAdd(false)} 
        onSuccess={fetchBudgets} 
      />

      {/* --- MODAL EDIT (Responsive Fix) --- */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 px-4">
          <div className="bg-white p-6 md:p-8 w-full max-w-md rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Edit Budget</h2>
                <button onClick={() => setEditData(null)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            
            <label className="block mb-2 text-gray-600 font-medium text-sm">Kategori</label>
            <input
              className="w-full p-3 md:p-4 border border-gray-200 rounded-xl mb-5 text-gray-500 bg-gray-50 cursor-not-allowed font-medium text-sm md:text-base"
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
            
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
              <button className="w-full md:w-auto px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition" onClick={() => setEditData(null)}>Batal</button>
              <button className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2" onClick={handleUpdate}><Save size={18} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT CONTAINER (Fluid & Scrollable) --- */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 overflow-y-auto bg-background dark:bg-background-dark z-0">
        
        {/* Wrapper Konten */}
        <main className="p-4 pt-6 pb-32 w-full max-w-[1920px] mx-auto flex flex-col gap-6">

          {/* Header Page & Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-black dark:text-text-white">Budget Planning</h1>
              <p className="text-text-grey dark:text-text-grey-dark text-sm md:text-base mt-1">
                Kelola target pengeluaranmu agar tetap hemat.
              </p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-semibold"
            >
              <Plus size={20} />
              Tambah Budget
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="bg-background-card dark:bg-background-card-dark px-4 pt-2 rounded-2xl shadow-sm border border-border dark:border-border-dark flex-wrap items-center gap-4 top-0 z-20">
             <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {[
                    { key: 'active', label: 'Sedang Berjalan', icon: <Clock size={16}/> },
                    { key: 'upcoming', label: 'Akan Datang', icon: <Calendar size={16}/> },
                    { key: 'expired', label: 'Selesai / Lewat', icon: <CheckCircle size={16}/> }
                ].map(tab => (
                    <button 
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`flex items-center gap-2 px-4 py-4 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                            filterStatus === tab.key 
                            ? "text-blue-600 border-blue-600" 
                            : "text-text-black dark:text-text-white border-transparent hover:text-[#bcaff0]"
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
             </div>
          </div>

          {/* List Budget Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                <Loader2 className="animate-spin" size={32}/>
                Loading budgets...
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-20 bg-background-card dark:bg-background-card-dark rounded-2xl border-2 border-dashed border-border dark:border-border-dark mx-auto w-full">
                <p className="text-gray-400 text-lg mb-2 px-4">Tidak ada budget dengan status <b>"{filterStatus}"</b>.</p>
                {filterStatus === 'active' && (
                    <button onClick={() => setShowAdd(true)} className="text-blue-600 font-semibold hover:underline">
                        Buat budget baru sekarang
                    </button>
                )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {budgets.map((item) => {
                const budgetId = item.budget_id;
                const categoryName = item.category_name;
                const limit = Number(item.limit_amount);
                const spent = Number(item.used_amount);
                
                const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const safePercent = percent > 100 ? 100 : percent; 
                const barColor = filterStatus === 'upcoming' ? 'bg-blue-200' : getBarColor(percent);

                const catStyle = Object.keys(categoryIcons).find(key => categoryName.includes(key)) 
                                ? categoryIcons[Object.keys(categoryIcons).find(key => categoryName.includes(key))]
                                : categoryIcons["Default"];

                return (
                  <div
                    key={budgetId}
                    className={`p-5 border border-border dark:border-border-dark rounded-2xl shadow-sm hover:shadow-md transition-all bg-background-card dark:bg-background-card-dark flex flex-col justify-between group relative ${filterStatus === 'expired' ? 'opacity-75 grayscale-[0.3]' : ''}`}
                  >
                    <div>
                        {/* Header Kartu */}
                        <div className="flex justify-between items-start mb-4">
                             {/* Badge Tanggal */}
                             <div className="flex items-center gap-1.5 text-xs font-medium text-text-grey dark:text-text-grey-dark bg-background-box dark:bg-background-box-dark px-2.5 py-1 rounded-md">
                                <Calendar size={12} />
                                <span>{formatDate(item.period_start)} - {formatDate(item.period_end)}</span>
                             </div>
                             
                             <button 
                                onClick={() => handleDelete(budgetId)}
                                // Di mobile, tombol hapus selalu terlihat (opacity-100), di desktop muncul saat hover
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition lg:opacity-0 lg:group-hover:opacity-100"
                                title="Hapus Budget"
                             >
                                <Trash2 size={16} />
                             </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl shadow-inner ${catStyle.color} bg-opacity-90 text-white shrink-0`}>
                                {catStyle.icon}
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-lg font-bold text-text-black dark:text-text-white truncate">{categoryName}</h2>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {filterStatus === 'active' ? 'Sedang Berjalan' : filterStatus === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className={`font-bold ${percent > 100 ? 'text-red-600' : 'text-text-grey dark:text-text-grey-dark'}`}>{percent}%</span>
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
                                <p className={`font-semibold text-sm sm:text-base ${percent > 100 ? "text-red-600" : "text-text-black dark:text-text-white"}`}>{formatRupiah(spent)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Limit</p>
                                <p className="font-bold text-sm sm:text-base text-text-black dark:text-text-white">{formatRupiah(limit)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Edit */}
                    {filterStatus !== 'expired' && (
                        <button
                        className="w-full mt-4 py-2.5 bg-background-box dark:bg-background-box-dark text-text-black dark:text-text-white rounded-xl hover:bg-blue-50 hover:text-blue-600 transition font-medium border border-border dark:border-border-dark text-sm flex items-center justify-center gap-2 active:scale-95 duration-200"
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
        </main>
      </div>
    </div>
  );
}