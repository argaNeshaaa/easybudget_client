import { useEffect, useState } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import AccountChart from "./AccountChart";
import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";
import "../../assets/styles/global.css";
import api from "../../api/axios";
import {
  CreditCard,
  Wallet as WalletIcon,
  Banknote,
  ArrowRightLeft,
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

  // ✅ 3. Callback Edit (Sukses Edit)
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
    if (lowerType.includes("cash") || lowerType.includes("tunai"))
      return "from-green-600 to-green-400";
    if (
      lowerType.includes("wallet") ||
      lowerType.includes("dana") ||
      lowerType.includes("gopay")
    )
      return "from-sky-600 to-sky-400";
    return "from-gray-700 to-gray-500";
  };

  const totalGlobalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  return (
    // UBAH LAYOUT: Gunakan h-screen & overflow-hidden pada parent utama
    <div className="h-screen w-screen bg-[#F3F4F6] font-gabarito overflow-hidden flex flex-col">
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
        onSuccess={handleAccountChange}
        accountData={currentAccount}
      />

      {/* CONTENT CONTAINER (SCROLLABLE AREA) 
         - Fixed position agar area ini punya scrollbar sendiri
         - top-[5rem]: Mulai di bawah header
         - bottom-0: Mentok ke bawah layar
         - overflow-y-auto: Mengaktifkan scroll
      */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 overflow-y-auto bg-[#F3F4F6] z-0">
        {/* Main Content Wrapper */}
        <main className="p-4 pt-6 pb-32 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
          {/* HEADER SECTION: Judul & Tombol Tambah */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Wallets</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola semua akun keuangan Anda di sini
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              <Plus size={18} />
              Tambah Akun
            </button>
          </div>

          {/* SECTION 1: ACCOUNT CARD SLIDER & STATS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
            {accounts.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* --- LEFT: SLIDER KARTU --- */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                  {/* Header Jenis Akun */}
                  <div className="flex items-center gap-3 mb-6 w-full max-w-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <CreditCard className="text-blue-600 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                      {currentAccount?.account_type || "Account"}
                    </h2>
                  </div>

                  {/* VISUAL KARTU ATM */}
                  <div className="relative w-full max-w-sm aspect-[1.58/1] perspective-1000 group">
                    <div
                      className={`w-full h-full rounded-3xl bg-gradient-to-br ${getCardStyle(
                        currentAccount?.account_type
                      )} text-white p-6 shadow-xl flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02]`}
                    >
                      {/* Tombol Edit Floating */}
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition z-10"
                        title="Edit Akun"
                      >
                        <Pencil size={16} className="text-white" />
                      </button>

                      <div className="flex justify-between items-start">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-wide truncate pr-8">
                          {currentAccount?.account_name}
                        </h3>
                      </div>

                      <div className="text-lg sm:text-2xl tracking-widest font-mono my-2">
                        {currentAccount?.account_number &&
                        currentAccount?.account_number !== "-"
                          ? currentAccount.account_number
                              .replace(/(\d{4})/g, "$1 ")
                              .trim()
                          : "**** **** ****"}
                      </div>

                      <div className="flex justify-between items-end text-sm">
                        <div>
                          <p className="opacity-70 text-[10px] sm:text-xs uppercase font-medium">
                            Balance
                          </p>
                          <p className="font-bold text-base sm:text-xl truncate max-w-[150px]">
                            {formatRupiah(currentAccount?.balance)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-70 text-[10px] sm:text-xs uppercase font-medium">
                            Category
                          </p>
                          <p className="font-semibold uppercase">
                            {currentAccount?.wallet_category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Dots & Buttons */}
                  <div className="flex items-center justify-between w-full max-w-sm mt-6">
                    <button
                      onClick={prevCard}
                      className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <div className="flex space-x-2">
                      {accounts.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "bg-blue-600 w-6"
                              : "bg-gray-300 w-2"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextCard}
                      className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                {/* --- RIGHT: DETAIL STATISTIK AKUN INI --- */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                      Saldo Akun Ini
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                      {formatRupiah(currentAccount?.balance)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-full">
                          <ArrowRightLeft
                            size={16}
                            className="text-green-700"
                          />
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          Pemasukan
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-700">
                        {formatRupiah(currentAccount?.total_income)}
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-200 rounded-full">
                          <ArrowRightLeft size={16} className="text-red-700" />
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          Pengeluaran
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-700">
                        {formatRupiah(currentAccount?.total_expense)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                      Status: Active
                    </span>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <span>ID: #{currentAccount?.account_id}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <WalletIcon className="text-gray-400 w-8 h-8" />
                </div>
                <p className="text-gray-500 mb-4">
                  Belum ada akun yang terdaftar.
                </p>
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

          {/* SECTION 2: GLOBAL SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Aset */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Total Aset Global
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatRupiah(totalGlobalBalance)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <WalletIcon className="text-blue-600 w-6 h-6" />
              </div>
            </div>

            {/* Jumlah Akun */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Jumlah Akun
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {accounts.length} Akun
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <CreditCard className="text-yellow-600 w-6 h-6" />
              </div>
            </div>

            {/* Uang Tunai */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Uang Tunai
                </p>
                <p className="text-xl font-bold text-green-600">
                  {formatRupiah(
                    accounts
                      .filter((a) =>
                        ["cash", "tunai"].includes(a.account_type.toLowerCase())
                      )
                      .reduce((sum, a) => sum + Number(a.balance), 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Banknote className="text-green-600 w-6 h-6" />
              </div>
            </div>

            {/* Bank & E-Wallet */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Bank & E-Wallet
                </p>
                <p className="text-xl font-bold text-sky-600">
                  {formatRupiah(
                    accounts
                      .filter(
                        (a) =>
                          !["cash", "tunai"].includes(
                            a.account_type.toLowerCase()
                          )
                      )
                      .reduce((sum, a) => sum + Number(a.balance), 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl">
                <CreditCard className="text-sky-600 w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SECTION 3: CHART */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Analisis Transaksi Bulan Ini
                </h2>
                <p className="text-sm text-gray-500">
                  Tren harian:{" "}
                  <span className="font-semibold text-blue-600">
                    {currentAccount?.account_name || "-"}
                  </span>
                </p>
              </div>
            </div>

            {/* --- PERBAIKAN DISINI --- */}
            {/* 1. overflow-x-auto: Agar bisa di-scroll ke samping di HP */}
            {/* 2. pb-4: Memberi ruang untuk scrollbar */}
            <div className="w-full overflow-x-auto pb-4">
              {/* 3. min-w-[800px]: Memaksa grafik melebar minimal 800px (lebih lebar dari layar HP) */}
              {/* Sehingga user harus scroll untuk melihat semuanya, tapi datanya jelas */}
              <div className="min-w-[800px] h-[300px]">
                <AccountChart accountId={currentAccount?.account_id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Wallet;
