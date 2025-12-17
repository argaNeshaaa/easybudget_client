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

  // --- API CALL ---
  const fetchGoals = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) return;

    try {
      setLoading(true);
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
                await api.delete(`/goals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: "Terhapus!",
                    text: "Goal berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchGoals();
            } catch (err) {
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

  // Ringkasan
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const goalCount = goals.length;

  return (
    <div className="h-screen w-screen font-gabarito overflow-hidden flex flex-col">
      <Sidebar />
      <Header />

      {/* --- CONTENT CONTAINER (Scrollable) --- */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 overflow-y-auto bg-background dark:bg-background-dark z-0">
        
        {/* Wrapper Konten */}
        <main className="p-4 pt-6 pb-32 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
            
          {/* Header Page & Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-black dark:text-text-white">Financial Goals</h1>
              <p className="text-text-grey dark:text-text-grey-dark text-sm md:text-base mt-1">Wujudkan impianmu dengan menabung secara teratur.</p>
            </div>
            <button 
              onClick={() => setIsAddOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              <Plus size={20} />
              Target Baru
            </button>
          </div>

          {/* SUMMARY CARD (Responsive Grid) */}
          <div className="bg-background-card dark:bg-background-card-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            
            {/* Item 1 */}
            <div className="flex items-center gap-4 sm:pr-4 pt-4 sm:pt-0 first:pt-0">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 shrink-0"><Target size={24} /></div>
              <div>
                <p className="text-xs sm:text-sm text-text-grey dark:text-text-grey-dark mb-1">Total Target Dana</p>
                <p className="text-lg sm:text-xl font-bold text-text-black dark:text-text-white truncate">{formatRupiah(totalTarget)}</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
              <div className="p-3 bg-green-100 rounded-full text-green-600 shrink-0"><Coins size={24} /></div>
              <div>
                <p className="text-xs sm:text-sm text-text-grey dark:text-text-grey-dark mb-1">Sudah Terkumpul</p>
                <p className="text-lg sm:text-xl font-bold text-text-black dark:text-text-white truncate">{formatRupiah(totalSaved)}</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-4 sm:pl-4 pt-4 sm:pt-0">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 shrink-0"><Trophy size={24} /></div>
              <div>
                <p className="text-xs sm:text-sm text-text-grey dark:text-text-grey-dark mb-1">Jumlah Goals</p>
                <p className="text-lg sm:text-xl font-bold text-text-black dark:text-text-white">{goalCount}</p>
              </div>
            </div>
          </div>

          {/* --- FILTER TABS --- */}
          <div className="bg-background-card dark:bg-background-card-dark px-4 pt-2 rounded-2xl shadow-sm border border-border dark:border-border-dark flex-wrap items-center gap-4 top-0 z-20">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                  { key: 'all', label: 'Semua', icon: <Target size={16}/> },
                  { key: 'ongoing', label: 'Sedang Berjalan', icon: <PlayCircle size={16}/> },
                  { key: 'achieved', label: 'Tercapai', icon: <Trophy size={16}/> },
                  { key: 'failed', label: 'Gagal / Lewat', icon: <XCircle size={16}/> }
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

          {/* LIST GOALS */}
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-400 flex-col gap-2">
                <Loader2 className="animate-spin" size={32} />
                Loading...
            </div>
          ) : goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-background dark:bg-background-dark rounded-2xl border-2 border-dashed border-border dark:border-border-dark">
              <p className="text-text-grey dark:text-text-grey-dark mb-4 text-lg text-center px-4">Tidak ada goal dengan status <b>"{filterStatus}"</b>.</p>
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