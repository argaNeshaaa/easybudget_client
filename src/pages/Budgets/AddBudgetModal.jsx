import { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
export default function AddBudgetModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Default date setup (Bulan Ini)
  const date = new Date();
  const toLocalISO = (dt) => {
      const offset = dt.getTimezoneOffset() * 60000;
      return new Date(dt.getTime() - offset).toISOString().split('T')[0];
  }
  const firstDay = toLocalISO(new Date(date.getFullYear(), date.getMonth(), 1));
  const lastDay = toLocalISO(new Date(date.getFullYear(), date.getMonth() + 1, 0));

  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    period_start: firstDay,
    period_end: lastDay,
  });

  // Helper get user id
  const getUserIdFromToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).user_id;
    } catch (e) { return null; }
  };

  // Fetch Categories
  useEffect(() => {
    if (isOpen && token) {
      const fetchCats = async () => {
        const userId = getUserIdFromToken(token);
        try {
          const res = await api.get(`/categories/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCategories(res.data.data.filter(c => c.type === 'expense'));
        } catch (err) {
          console.error(err);
        }
      };
      fetchCats();
    }
  }, [isOpen, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.period_start > formData.period_end) {
      toast.error("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
        return;
    }

    setLoading(true);
    try {
      // Hapus titik format sebelum kirim
      const payload = {
          ...formData,
          amount: formData.amount.replace(/\./g, "")
      };

      await api.post("/budgets", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Buat Budget Baru Berhasil!");
      onSuccess();
      onClose();
      // Reset form (kecuali tanggal)
      setFormData(prev => ({ ...prev, category_id: "", amount: "" }));
    } catch (err) {
      toast.error("Gagal membuat budget: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Buat Budget Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Dropdown Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Pengeluaran</label>
            <div className="relative">
                <select
                required
                className="w-full text-black p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white transition"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                >
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => (
                    <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">▼</div>
            </div>
          </div>

          {/* Input Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batas Nominal (Rp)</label>
            <div className="flex items-center border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden transition">
                <div className="bg-gray-50 px-4 py-3 text-gray-500 font-semibold border-r border-gray-200">Rp</div>
                <input
                    type="text"
                    required
                    className="w-full p-3 text-black outline-none font-semibold text-gray-800"
                    value={formData.amount}
                    onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({...formData, amount: val ? formatNumber(val) : ""});
                    }}
                    placeholder="0"
                />
            </div>
          </div>

          {/* Periode */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3 text-blue-700 font-medium text-sm">
                <Calendar size={16} />
                <span>Periode Budget</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Mulai</label>
                <input
                    type="date"
                    required
                    className="w-full text-black p-2 border border-blue-200 rounded-lg text-sm focus:outline-blue-500"
                    value={formData.period_start}
                    onChange={e => setFormData({...formData, period_start: e.target.value})}
                />
                </div>
                <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Selesai</label>
                <input
                    type="date"
                    required
                    className="w-full text-black p-2 border border-blue-200 rounded-lg text-sm focus:outline-blue-500"
                    value={formData.period_end}
                    onChange={e => setFormData({...formData, period_end: e.target.value})}
                />
                </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
                Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}