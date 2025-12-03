import { useState, useEffect } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { 
  Search, Filter, ChevronLeft, ChevronRight, Plus, 
  Calendar, ArrowUpCircle, ArrowDownCircle, Edit, Trash2, Tag // Tambah icon Tag
} from "lucide-react";
import api from "../../api/axios";
import EditTransactionModal from "./EditTransactionModal";
import AddTransactionModal from "./AddTransactionModal";
import AddCategoryModal from "./AddCategoryModal"; // <--- Import Component Baru
import "../../assets/styles/global.css";

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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // <--- State Modal Kategori

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

      // Validasi response backend
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

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus transaksi ini?")) {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTransactions();
        } catch (err) {
            alert("Gagal menghapus");
        }
    }
  }

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction); // Simpan data transaksi yang mau diedit
    setIsEditModalOpen(true);            // Buka modal
  };

  // Handler Sukses Edit
  const handleEditSuccess = () => {
    fetchTransactions(); // Refresh tabel
  };

  const handleAddSuccess = () => {
    fetchTransactions();
  };

  // Handler Sukses Tambah Kategori
  const handleCategorySuccess = () => {
    // Opsional: Lakukan sesuatu setelah kategori ditambah, misal notif
    // Tidak perlu fetchTransactions karena list transaksi tidak berubah
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
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

      {/* Modal Tambah Kategori */}
      <AddCategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleCategorySuccess}
      />

      {/* --- CONTAINER UTAMA --- */}
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-auto pb-10 flex items-center justify-start flex-col w-full">
          
          {/* WRAPPER KONTEN */}
          <div className="w-full px-6 mt-4">

            {/* HEADER PAGE */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Daftar Transaksi</h1>
                <p className="text-gray-500 mt-1">Kelola dan pantau arus keuanganmu.</p>
              </div>
              
              <div className="flex gap-3">
                {/* Tombol Tambah Kategori (Secondary Button) */}
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm border border-gray-200"
                >
                  <Tag size={20} />
                  Kategori Baru
                </button>

                {/* Tombol Tambah Transaksi (Primary Button) */}
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
                >
                  <Plus size={20} />
                  Tambah Transaksi
                </button>
              </div>
            </div>

            {/* FILTER BAR CARD */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
              
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari deskripsi, kategori..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700 font-medium"
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
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Calendar size={18} className="text-gray-400" />
                <input 
                  type="date" 
                  name="startDate"
                  className="bg-transparent focus:outline-none text-sm text-gray-600"
                  value={filters.startDate}
                  onChange={handleDateChange}
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="date" 
                  name="endDate"
                  className="bg-transparent focus:outline-none text-sm text-gray-600"
                  value={filters.endDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50">
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
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400">Memuat data...</td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400">Tidak ada transaksi ditemukan.</td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.transaction_id} className="hover:bg-gray-50/50 transition">
                          
                          {/* Tanggal */}
                          <td className="p-4 align-top">
                            <div className="text-sm font-medium text-gray-700">{formatDate(tx.date)}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* Kategori & Akun */}
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

                          {/* Deskripsi */}
                          <td className="p-4 align-top">
                            <p className="text-sm text-gray-600 line-clamp-2">{tx.description || "-"}</p>
                          </td>

                          {/* Amount */}
                          <td className="p-4 align-top text-right">
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              tx.type === 'income' 
                                ? 'bg-green-50 text-green-600' 
                                : 'bg-red-50 text-red-600'
                            }`}>
                              {tx.type === 'income' ? '+ ' : '- '}
                              {formatRupiah(tx.amount)}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-4 align-top text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(tx)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                  <Edit size={16} />
                              </button>
                              <button 
                                  onClick={() => handleDelete(tx.transaction_id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                                  title="Hapus"
                              >
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
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <span className="text-sm text-gray-500">
                  Menampilkan halaman <span className="font-bold text-gray-800">{pagination.page}</span> dari {pagination.totalPages}
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

          </div>
        </div>
      </div>
    </div>
  );
}