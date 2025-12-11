import { useEffect, useState } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import AccountChart from "./AccountChart"; 
import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";
import "../../assets/styles/global.css";
import api from "../../api/axios";
import { CreditCard, Wallet as WalletIcon, Banknote, ArrowRightLeft, Plus, Pencil } from "lucide-react"; // Tambahkan Pencil

// Helper Format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

function Wallet() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  
  // State Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const token = localStorage.getItem("token");

  // ✅ 1. Fetch Data
  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/summary/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.data);
    } catch (err) {
      console.error("Gagal load accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAccounts();
  }, [token]);

  // ✅ 2. Callback Add (Sukses Tambah)
  const handleAccountAdded = () => {
    fetchAccounts(); 
  };

  // ✅ 3. Callback Edit (Sukses Edit) -- INI YANG HILANG SEBELUMNYA
  const handleAccountChange = () => {
    fetchAccounts(); 
  };

  // Fungsi Navigasi Slider
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % accounts.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + accounts.length) % accounts.length);
  };

  const currentAccount = accounts[currentIndex];

  const getCardStyle = (type) => {
    const lowerType = type?.toLowerCase() || "";
    if (lowerType.includes("bank")) return "from-blue-600 to-blue-400";
    if (lowerType.includes("cash") || lowerType.includes("tunai")) return "from-green-600 to-green-400";
    if (lowerType.includes("wallet") || lowerType.includes("dana") || lowerType.includes("gopay")) return "from-sky-600 to-sky-400";
    return "from-gray-700 to-gray-500";
  };

  const totalGlobalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalGlobalIncome = accounts.reduce((sum, acc) => sum + Number(acc.total_income), 0);
  const totalGlobalExpense = accounts.reduce((sum, acc) => sum + Number(acc.total_expense), 0);

  // if (loading) return <div className="h-screen flex items-center justify-center bg-gray-100">Loading Wallet...</div>;

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />
      
      {/* Modal Add */}
      <AddAccountModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleAccountAdded} 
      />

      {/* Modal Edit */}
      <EditAccountModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={handleAccountChange} // Sekarang tidak error lagi
        accountData={currentAccount} 
      />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-auto text-white flex items-center justify-start flex-col">
          
          <div className="w-full h-max flex flex-between items-center justify-between mt-[1rem] mb-[1rem]">
            <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] ml-[1rem] rounded-xl shadow-md relative">
              
              {/* Tombol Tambah */}
              <div className="absolute top-6 right-6 z-20">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  <Plus size={18} />
                  Tambah Akun
                </button>
              </div>

              {accounts.length > 0 ? (
                <div className="w-full h-full p-6 flex">
                  
                  {/* LEFT: SLIDER */}
                  <div className="w-1/2 pr-6 flex flex-col justify-center">
                    
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="text-blue-600 w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 ml-3 capitalize">
                        {currentAccount?.account_type || "Account"}
                      </h2>
                    </div>

                    {/* KARTU */}
                    <div className={`w-full max-w-[22rem] h-[14rem] rounded-3xl bg-gradient-to-br ${getCardStyle(currentAccount?.account_type)} text-white p-6 shadow-xl transform transition-all duration-500 hover:scale-105 mx-auto relative group`}>
                      
                      {/* 🔥 TOMBOL EDIT (Hanya muncul saat hover) */}
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                        title="Edit Akun Ini"
                      >
                        <Pencil size={16} className="text-white" />
                      </button>

                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold tracking-wide">{currentAccount?.account_name}</h3>
                        <div className="text-right">
                          <p className="text-sm opacity-80 uppercase">{currentAccount?.wallet_category}</p>
                        </div>
                      </div>

                      <div className="mt-8 text-xl tracking-widest font-mono">
                        {currentAccount?.account_number 
                          ? currentAccount.account_number.replace(/(\d{4})/g, '$1 ').trim() 
                          : "**** **** ****"}
                      </div>

                      <div className="flex justify-between mt-8 text-sm">
                        <div>
                          <p className="opacity-70 text-xs uppercase">Balance</p>
                          <p className="font-semibold text-lg">{formatRupiah(currentAccount?.balance)}</p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-70 text-xs uppercase">ID</p>
                          <p>#{currentAccount?.account_id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigasi */}
                    <div className="flex items-center justify-center mt-8 space-x-6 text-gray-500">
                      <button onClick={prevCard} className="hover:text-blue-600 transition font-medium text-sm">
                        ‹ Sebelumnya
                      </button>
                      <div className="flex space-x-2">
                        {accounts.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <button onClick={nextCard} className="hover:text-blue-600 transition font-medium text-sm">
                        Selanjutnya ›
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: STATS */}
                  <div className="w-1/2 pl-6 border-l border-gray-100 flex flex-col justify-center">
                    <div className="mb-8">
                      <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Saldo Saat Ini</p>
                      <p className="text-4xl font-bold text-gray-800 mt-1">{formatRupiah(currentAccount?.balance)}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="p-1.5 bg-green-200 rounded-full">
                             <ArrowRightLeft size={14} className="text-green-700" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">Total Pemasukan (Akun Ini)</p>
                        </div>
                        <p className="text-xl font-bold text-green-600 ml-9">{formatRupiah(currentAccount?.total_income)}</p>
                      </div>

                      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="p-1.5 bg-red-200 rounded-full">
                             <ArrowRightLeft size={14} className="text-red-700" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">Total Pengeluaran (Akun Ini)</p>
                        </div>
                        <p className="text-xl font-bold text-red-600 ml-9">{formatRupiah(currentAccount?.total_expense)}</p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Account Type</p>
                        <p className="font-medium text-gray-700 capitalize">{currentAccount?.account_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="font-medium text-green-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                  <p>Belum ada akun yang terdaftar.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                  >
                    <Plus size={20} />
                    Buat Akun Pertama
                  </button>
                </div>
              )}
            </div>

            {/* BOX KANAN ATAS */}
            <div className="w-[50.7rem] h-[30rem] flex flex-col">
              <div className="w-full h-[50%] mt-[10px]">
                <div className="w-full h-[50%] flex items-start justify-between">
                  <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex items-center hover:shadow-lg transition">
                    <div className="w-2 h-full bg-blue-500 rounded-l-xl"></div>
                    <div className="p-5 w-full">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-gray-500 text-sm font-medium">Total Aset (Semua Akun)</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(totalGlobalBalance)}</p>
                         </div>
                         <div className="p-2 bg-blue-100 rounded-lg"><WalletIcon className="text-blue-600" size={24}/></div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex items-center hover:shadow-lg transition">
                    <div className="w-2 h-full bg-yellow-400 rounded-l-xl"></div>
                    <div className="p-5 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-500 text-sm font-medium">Jumlah Akun</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{accounts.length} Akun</p>
                          </div>
                          <div className="p-2 bg-yellow-100 rounded-lg"><CreditCard className="text-yellow-600" size={24}/></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[50%] flex items-center justify-between">
                  <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex items-center hover:shadow-lg transition">
                    <div className="w-2 h-full bg-green-500 rounded-l-xl"></div>
                    <div className="p-5 w-full">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-gray-500 text-sm font-medium">Total Pemasukan</p>
                            <p className="text-xl font-bold text-gray-800 mt-1">{formatRupiah(totalGlobalIncome)}</p>
                         </div>
                         <div className="p-2 bg-green-100 rounded-lg"><ArrowRightLeft className="text-green-600" size={20}/></div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex items-center hover:shadow-lg transition">
                    <div className="w-2 h-full bg-red-500 rounded-l-xl"></div>
                    <div className="p-5 w-full">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-gray-500 text-sm font-medium">Total Pengeluaran</p>
                            <p className="text-xl font-bold text-gray-800 mt-1">{formatRupiah(totalGlobalExpense)}</p>
                         </div>
                         <div className="p-2 bg-red-100 rounded-lg"><ArrowRightLeft className="text-red-600" size={20}/></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[50%] flex items-end justify-between mb-[10px]">
                <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex p-5 items-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Banknote className="text-green-600" size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Cash / Tunai</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatRupiah(accounts.filter(a => a.account_type.toLowerCase() === 'cash' || a.account_type.toLowerCase() === 'tunai').reduce((sum, a) => sum + Number(a.balance), 0))}
                    </p>
                  </div>
                </div>

                <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex p-5 items-center">
                  <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                    <WalletIcon className="text-sky-600" size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Bank & E-Wallet</p>
                    <p className="text-xl font-bold text-sky-600">
                      {formatRupiah(accounts.filter(a => a.account_type.toLowerCase() !== 'cash' && a.account_type.toLowerCase() !== 'tunai').reduce((sum, a) => sum + Number(a.balance), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* SECTION 2: CHARTS */}
          <div className="w-full h-max flex flex-between items-center justify-between mt-[1rem] mb-[1rem]">
             <div className="dashboard-card w-full bg-white ml-[1rem] mr-[1rem] p-6 rounded-xl shadow-md flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                   <div>
                      <h2 className="text-xl font-bold text-gray-800">Analisis Transaksi Bulan Ini</h2>
                      <p className="text-sm text-gray-500">
                         Menampilkan tren harian untuk akun: 
                         <span className="font-bold text-blue-600 ml-1">
                            {currentAccount?.account_name || "Loading..."}
                         </span>
                      </p>
                   </div>
                </div>

                <AccountChart accountId={currentAccount?.account_id} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Wallet;