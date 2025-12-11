import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
export default function AddTransactionModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const token = localStorage.getItem("token");

  // State Form Default
  const [formData, setFormData] = useState({
    type: "expense", // Default pengeluaran
    date: new Date().toISOString().split('T')[0], // Default hari ini
    account_id: "",
    category_id: "",
    amount: "",
    description: "",
  });

  // --- HELPER: Ambil User ID dari Token ---
  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload).user_id;
    } catch (error) {
      console.error("Gagal decode token:", error);
      return null;
    }
  };

  // 1. Fetch Data Master (Accounts & Categories) saat Modal Dibuka
  useEffect(() => {
    if (isOpen && token) {
      const fetchData = async () => {
        const userId = getUserIdFromToken(token);
        if (!userId) return;

        try {
          // Panggil 2 API sekaligus (Parallel) agar cepat
          const [resAccounts, resCategories] = await Promise.all([
            // Ambil daftar akun (kita pakai endpoint stats karena itu me-return list akun user)
            api.get("/accounts/summary/stats", { headers: { Authorization: `Bearer ${token}` } }),
            // Ambil daftar kategori user
            api.get(`/categories/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
          ]);

          setAccounts(resAccounts.data.data);
          setCategories(resCategories.data.data);

          // Set default account jika ada
          if (resAccounts.data.data.length > 0) {
            setFormData(prev => ({ ...prev, account_id: resAccounts.data.data[0].account_id }));
          }

        } catch (err) {
          console.error("Gagal load data master:", err);
        }
      };
      
      fetchData();
    }
  }, [isOpen, token]);

  // 2. Filter Kategori berdasarkan Tipe (Income/Expense)
  const filteredCategories = categories.filter(c => c.type === formData.type);

  // 3. Reset kategori jika tipe berubah
  useEffect(() => {
    // Jika kategori yang dipilih saat ini tidak cocok dengan tipe baru, reset.
    const currentCategory = categories.find(c => c.category_id == formData.category_id);
    if (currentCategory && currentCategory.type !== formData.type) {
      setFormData(prev => ({ ...prev, category_id: "" }));
    }
  }, [formData.type, categories]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST ke /transactions
      await api.post("/transactions", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Tambah Transaksi Berhasil!");
      onSuccess(); // Refresh parent
      onClose();   // Tutup modal
      
      // Reset Form (kecuali tanggal biar user enak kalau mau input lagi)
      setFormData(prev => ({
        ...prev,
        amount: "",
        description: "",
        category_id: "",
        // account_id biarkan yang terakhir dipilih
      }));

    } catch (err) {
      console.error("Gagal tambah transaksi:", err);
      toast.error(err.response?.data?.message || "Gagal menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b border-gray-100 ${formData.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className={`text-xl font-bold ${formData.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
            Tambah {formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* TIPE & TANGGAL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Transaksi</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    formData.type === "expense" 
                      ? "bg-white text-red-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    formData.type === "income" 
                      ? "bg-white text-green-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pemasukan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full text-black p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* AKUN & KATEGORI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Akun / Wallet</label>
              <select
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                required
                className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>-- Pilih Akun --</option>
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <option key={acc.account_id} value={acc.account_id}>
                      {acc.account_name} ({acc.account_type})
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada akun</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full  text-black p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Kategori kosong</option>
                )}
              </select>
            </div>
          </div>

          {/* NOMINAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Nominal (Rp)</label>
            <input
              type="number"
              name="amount"
              placeholder="0"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              className="w-full text-black p-4 text-lg font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Catatan</label>
            <textarea
              name="description"
              rows="2"
              placeholder="Contoh: Makan siang nasi padang..."
              value={formData.description}
              onChange={handleChange}
              className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                formData.type === 'income' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Simpan Transaksi
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}