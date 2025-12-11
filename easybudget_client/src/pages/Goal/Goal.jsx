import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { Plus, Loader2, Target, Trophy, Coins, PlayCircle, XCircle } from "lucide-react";
import api from "../../api/axios";
import GoalCard from "./GoalCard";
import AddGoalModal from "./AddGoalModal";
import AddMoneyModal from "./AddMoneyModal";
import "../../assets/styles/global.css";
import Swal from "sweetalert2";
export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, ongoing, achieved, failed
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

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

  // --- API CALL ---
  const fetchGoals = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) return;

    try {
      setLoading(true);
      // Kirim parameter status jika bukan 'all'
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      
      const res = await api.get(`/goals/users/${userId}`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: params
      });
      setGoals(res.data.data);
    } catch (err) {
      console.error("Gagal load goals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ulang saat filter berubah
  useEffect(() => {
    if (token) fetchGoals();
  }, [token, filterStatus]);

  // --- HANDLERS ---
  const handleDelete = (id) => {
    Swal.fire({
        title: "Hapus Goal?",
        text: "Apakah Anda yakin ingin menghapus goal ini? Data tidak bisa dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Warna merah (tanda bahaya)
        cancelButtonColor: "#3085d6", // Warna biru (tombol batal)
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then(async (result) => {
        // Logika ini hanya jalan jika user menekan tombol "Ya, Hapus!"
        if (result.isConfirmed) {
            try {
                // Ambil token (pastikan variable token tersedia di scope ini atau ambil dari localStorage)
                const token = localStorage.getItem("token"); 

                await api.delete(`/goals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Tampilkan pesan sukses singkat (langsung hilang sendiri)
                Swal.fire({
                    title: "Terhapus!",
                    text: "Goal berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Update tampilan data
                fetchGoals();

            } catch (err) {
                console.error(err);
                // Tampilkan pesan error jika gagal
                Swal.fire({
                    title: "Gagal!",
                    text: err.response?.data?.message || "Gagal menghapus goal.",
                    icon: "error"
                });
            }
        }
    });
};

  const handleOpenTopUp = (goal) => {
      setSelectedGoal(goal);
      setIsTopUpOpen(true);
  };

  // Ringkasan (Dihitung dari semua data sebelum difilter di backend sebaiknya, 
  // tapi karena backend filter, ringkasan ini akan mengikuti filter aktif. 
  // Jika ingin ringkasan total global, perlu endpoint terpisah atau fetch 'all' dulu lalu filter client-side.
  // Di sini kita asumsikan ringkasan mengikuti apa yang ditampilkan)
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const goalCount = goals.length;

  return (
    <div className="flex h-screen w-full bg-gray-100 font-gabarito overflow-hidden">
      <Sidebar />
        <Header />
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] p-8 overflow-y-auto rounded-lg">

        <main className="flex-1 overflow-y-auto bg-[#E5E9F1]">
          <div className="max-w-auto mx-auto flex flex-col gap-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Financial Goals</h1>
                <p className="text-gray-500 mt-1">Wujudkan impianmu dengan menabung secara teratur.</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                <Plus size={20} />
                Target Baru
              </button>
            </div>

            {/* SUMMARY CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 border-r border-gray-100 last:border-0 pr-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Target size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Target Dana</p>
                  <p className="text-xl font-bold text-gray-800">{formatRupiah(totalTarget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-r border-gray-100 last:border-0 pr-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600"><Coins size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sudah Terkumpul</p>
                  <p className="text-xl font-bold text-gray-800">{formatRupiah(totalSaved)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><Trophy size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jumlah Goals</p>
                  <p className="text-xl font-bold text-gray-800">{goalCount}</p>
                </div>
              </div>
            </div>

            {/* --- FILTER TABS --- */}
            <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
                {[
                    { key: 'all', label: 'Semua', icon: <Target size={16}/> },
                    { key: 'ongoing', label: 'Sedang Berjalan', icon: <PlayCircle size={16}/> },
                    { key: 'achieved', label: 'Tercapai', icon: <Trophy size={16}/> },
                    { key: 'failed', label: 'Gagal / Lewat', icon: <XCircle size={16}/> }
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

            {/* LIST GOALS */}
            {loading ? (
              <div className="flex justify-center items-center h-64 text-gray-400 flex-col gap-2">
                  <Loader2 className="animate-spin" size={32} />
                  Loading...
              </div>
            ) : goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400 mb-4 text-lg">Tidak ada goal dengan status <b>"{filterStatus}"</b>.</p>
                {filterStatus === 'all' && (
                    <button onClick={() => setIsAddOpen(true)} className="text-blue-600 font-semibold hover:underline">Buat sekarang</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.goal_id} 
                    goal={goal} 
                    onDelete={handleDelete}
                    onAddMoney={handleOpenTopUp}
                  />
                ))}
              </div>
            )}

          </div>
        </main>

        {/* MODALS */}
        <AddGoalModal 
            isOpen={isAddOpen} 
            onClose={() => setIsAddOpen(false)} 
            onSuccess={fetchGoals} 
        />

        <AddMoneyModal 
            isOpen={isTopUpOpen} 
            onClose={() => setIsTopUpOpen(false)} 
            onSuccess={fetchGoals}
            goalData={selectedGoal}
        />

      </div>
    </div>
  );
}