import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function EditTransactionModal({ isOpen, onClose, onSuccess, transactionData }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  // State Form
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    type: "expense",
    category_id: "",
  });

  // --- HELPER: Ambil User ID dari Token ---
  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).user_id;
    } catch (error) {
      console.error("Gagal decode token:", error);
      return null;
    }
  };

  // 1. Fetch Categories (Sesuai User ID)
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token || !isOpen) return;

      const userId = getUserIdFromToken(token);
      if (!userId) return;

      try {
        // 🔥 UPDATE ENDPOINT: Gunakan endpoint user specific
        const res = await api.get(`/categories/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data);
      } catch (err) {
        console.error("Gagal load categories:", err);
      }
    };
    
    fetchCategories();
  }, [isOpen, token]);

  // 2. Populate Data (Isi form saat modal dibuka)
  useEffect(() => {
    if (isOpen && transactionData) {
      const formattedDate = transactionData.date 
        ? new Date(transactionData.date).toISOString().split('T')[0] 
        : "";

      setFormData({
        amount: transactionData.amount,
        description: transactionData.description || "",
        date: formattedDate,
        type: transactionData.type,
        category_id: transactionData.category_id || "",
      });
    }
  }, [isOpen, transactionData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/transactions/${transactionData.transaction_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error("Gagal update transaksi:", err);
      alert(err.response?.data?.message || "Gagal mengupdate transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Filter kategori agar sesuai tipe yang dipilih (Income/Expense)
  const filteredCategories = categories.filter(c => c.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit Transaksi</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Tipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kategori (Filtered) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>-- Pilih Kategori --</option>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada kategori untuk {formData.type}</option>
              )}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Info Read-only */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-700">
            Note: Akun/Wallet tidak dapat diubah setelah transaksi dibuat. Silakan hapus dan buat baru jika salah akun.
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Update Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}