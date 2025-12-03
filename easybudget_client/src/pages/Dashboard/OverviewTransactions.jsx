import { useEffect, useState } from "react";
import { Utensils, ShoppingBag, Landmark, X, ChevronLeft, ChevronRight } from "lucide-react"; // Tambah Chevron
import api from "../../api/axios";

export default function OverviewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tampilkan 5 item per halaman agar tidak perlu scroll panjang

  const token = localStorage.getItem("token");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/list/weekly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.data);
      } catch (err) {
        console.error("Gagal load transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTransactions();
  }, [token]);

  // --- LOGIC PAGINATION ---
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Hitung data yang akan ditampilkan berdasarkan halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const getIcon = (categoryName) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes("makan") || lower.includes("food")) return <Utensils size={20} className="text-white" />;
    if (lower.includes("belanja") || lower.includes("shopping")) return <ShoppingBag size={20} className="text-white" />;
    return <Landmark size={20} className="text-white" />;
  };

  if (loading) return <div className="p-6 text-gray-400">Loading Transactions...</div>;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      
      {/* HEADER */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Overview Transaksi</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Minggu Ini ({transactions.length})
          </span>
        </div>

        {/* LIST ITEMS (Hanya tampilkan currentTransactions) */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Belum ada transaksi minggu ini.</p>
          ) : (
            currentTransactions.map((tx) => (
              <div
                key={tx.transaction_id}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* KIRI */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-indigo-200 shadow-lg">
                    {getIcon(tx.category_name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{tx.category_name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{tx.account_name}</p>
                  </div>
                </div>

                {/* KANAN */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.type === 'income' ? '+ ' : ''}{formatRupiah(tx.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">{formatDate(tx.date)}</p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER PAGINATION (Hanya muncul jika ada data) */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Hal {currentPage} dari {totalPages || 1}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL POPUP (Kode Modal Tetap Sama) */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`p-6 text-white ${selectedTx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{selectedTx.type}</p>
                  <h2 className="text-3xl font-bold mt-1">{formatRupiah(selectedTx.amount)}</h2>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition">
                  <X size={24} className="text-white" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-white/90 text-sm">
                <span className="opacity-75">{formatDate(selectedTx.date)}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Category</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                      {getIcon(selectedTx.category_name)} 
                      <span className="text-indigo-600">{selectedTx.category_name}</span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Account</p>
                  <p className="text-gray-800 font-medium">{selectedTx.account_name}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Description</p>
                <p className="text-gray-700 italic">
                  {selectedTx.description || "Tidak ada deskripsi"}
                </p>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 mt-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}