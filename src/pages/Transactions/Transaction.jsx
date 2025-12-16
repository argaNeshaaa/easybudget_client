import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { 
  Search, Filter, ChevronLeft, ChevronRight, Plus, 
  Calendar, ArrowUpCircle, ArrowDownCircle, Edit, Trash2, Tag
} from "lucide-react";
import api from "../../api/axios";
import EditTransactionModal from "./EditTransactionModal";
import AddTransactionModal from "./AddTransactionModal";
import AddCategoryModal from "./AddCategoryModal"; 
import "../../assets/styles/global.css";
import Swal from "sweetalert2";

export default function Transactions() {
  // --- STATE MANAGEMENT ---
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "", 
    startDate: "",
    endDate: "",
  });

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Helper Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // State Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // --- API CALL ---
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          type: filters.type,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });

      const responseData = res.data.data;
      if (responseData && responseData.meta) {
        setTransactions(responseData.data);
        setPagination((prev) => ({
          ...prev,
          totalItems: responseData.meta.totalItems,
          totalPages: responseData.meta.totalPages,
        }));
      } else {
        setTransactions(Array.isArray(responseData) ? responseData : []);
      }

    } catch (err) {
      console.error("Gagal load transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [pagination.page, filters]); 

  // --- HANDLERS ---
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleTypeChange = (e) => {
    setFilters({ ...filters, type: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleDateChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
        title: "Yakin ingin menghapus?",
        text: "Transaksi yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await api.delete(`/transactions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: "Terhapus!",
                    text: "Transaksi berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchTransactions();
            } catch (err) {
                console.error(err);
                Swal.fire({
                    title: "Gagal!",
                    text: err.response?.data?.message || "Gagal menghapus transaksi.",
                    icon: "error"
                });
            }
        }
    });
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchTransactions();
  };

  const handleAddSuccess = () => {
    fetchTransactions();
  };

  const handleCategorySuccess = () => {
    // Optional logic
  };

  return (
    // LAYOUT FIX: Gunakan h-screen dan overflow-hidden pada parent utama
    <div className="h-screen w-screen bg-[#F3F4F6] font-gabarito overflow-hidden flex flex-col">
      <Sidebar />
      <Header />

      {/* --- MODALS --- */}
      <AddTransactionModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={handleAddSuccess}
      />

      <EditTransactionModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          transactionData={selectedTransaction}
      />

      <AddCategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleCategorySuccess}
      />

      {/* --- CONTENT CONTAINER (SCROLLABLE AREA) --- 
          Logic:
          - fixed/absolute: Memastikan area ini terpisah dari scroll browser
          - top-[5rem]: Memberi ruang untuk Header (asumsi tinggi header 5rem/20 tailwind)
          - lg:left-[18%]: Memberi ruang untuk Sidebar di Desktop
          - bottom-0: Mentok ke bawah layar
          - overflow-y-auto: Mengaktifkan scrollbar HANYA di area ini
      */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 overflow-y-auto bg-[#F3F4F6] z-0">
        
        {/* Wrapper Konten dengan Padding */}
        <main className="p-4 pb-32 w-full max-w-[1920px] mx-auto space-y-6">
            
          {/* HEADER PAGE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Daftar Transaksi</h1>
              <p className="text-gray-500 text-sm mt-1">Kelola dan pantau arus keuanganmu.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm border border-gray-200 text-sm"
              >
                <Tag size={18} />
                Kategori Baru
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 text-sm"
              >
                <Plus size={18} />
                Tambah Transaksi
              </button>
            </div>
          </div>

          {/* FILTER BAR CARD (Sticky saat di-scroll) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row flex-wrap items-center gap-4 sticky top-0 z-20">
            
            {/* Search */}
            <div className="w-full lg:flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari deskripsi, kategori..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700 text-sm"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
               {/* Type Filter */}
               <div className="relative w-full sm:w-auto">
                  <select 
                    className="w-full sm:w-40 pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700 font-medium text-sm"
                    value={filters.type}
                    onChange={handleTypeChange}
                  >
                    <option value="">Semua Tipe</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-auto">
                  <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                  <input 
                    type="date" 
                    name="startDate"
                    className="bg-transparent focus:outline-none text-sm text-gray-600 w-full"
                    value={filters.startDate}
                    onChange={handleDateChange}
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="date" 
                    name="endDate"
                    className="bg-transparent focus:outline-none text-sm text-gray-600 w-full"
                    value={filters.endDate}
                    onChange={handleDateChange}
                  />
                </div>
            </div>
          </div>

          {/* --- CONTENT AREA: TABLE (Desktop) vs CARDS (Mobile) --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
            
            {/* VIEW MOBILE: LIST CARD */}
            <div className="block lg:hidden">
               {loading ? (
                  <div className="p-8 text-center text-gray-400">Memuat data...</div>
               ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">Tidak ada transaksi ditemukan.</div>
               ) : (
                  <div className="divide-y divide-gray-100">
                     {transactions.map((tx) => (
                        <div key={tx.transaction_id} className="p-4 flex flex-col gap-3 hover:bg-gray-50 transition">
                           {/* Header Card: Tanggal & Amount */}
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-semibold text-gray-800">{formatDate(tx.date)}</p>
                                 <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                 {tx.type === 'income' ? '+ ' : '- '} {formatRupiah(tx.amount)}
                              </span>
                           </div>

                           {/* Body: Kategori, Akun, Deskripsi */}
                           <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full mt-1 flex-shrink-0 ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {tx.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-medium text-gray-800">{tx.category_name || "Tanpa Kategori"}</p>
                                 <p className="text-xs text-gray-500 mb-1">{tx.account_name} • {tx.wallet_name}</p>
                                 {tx.description && (
                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg italic">"{tx.description}"</p>
                                 )}
                              </div>
                           </div>

                           {/* Footer: Actions */}
                           <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                              <button 
                                 onClick={() => handleEditClick(tx)}
                                 className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                              >
                                 <Edit size={14} /> Edit
                              </button>
                              <button 
                                 onClick={() => handleDelete(tx.transaction_id)}
                                 className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                              >
                                 <Trash2 size={14} /> Hapus
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* VIEW DESKTOP: TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori & Akun</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Jumlah</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400">Memuat data...</td></tr>
                  ) : transactions.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400">Tidak ada transaksi ditemukan.</td></tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.transaction_id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 align-top">
                          <div className="text-sm font-medium text-gray-700">{formatDate(tx.date)}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{tx.category_name || "Tanpa Kategori"}</p>
                                <p className="text-xs text-gray-500">{tx.account_name} • {tx.wallet_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <p className="text-sm text-gray-600 line-clamp-2">{tx.description || "-"}</p>
                        </td>
                        <td className="p-4 align-top text-right">
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                            tx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {tx.type === 'income' ? '+ ' : '- '} {formatRupiah(tx.amount)}
                          </span>
                        </td>
                        <td className="p-4 align-top text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(tx.transaction_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30 sticky bottom-0 bg-white z-10">
              <span className="text-sm text-gray-500 text-center sm:text-left">
                Halaman <span className="font-bold text-gray-800">{pagination.page}</span> dari {pagination.totalPages}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-gray-700"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-gray-700"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}