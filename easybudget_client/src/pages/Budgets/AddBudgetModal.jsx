import { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar } from "lucide-react";
import api from "../../api/axios";

export default function AddBudgetModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  // Default: Awal bulan ini s/d Akhir bulan ini
  const date = new Date();
  // Perbaiki timezone offset agar tanggal tidak mundur 1 hari
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

  const getUserIdFromToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).user_id;
    } catch (e) { return null; }
  };

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
    
    // Validasi Tanggal
    if (formData.period_start > formData.period_end) {
        alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
        return;
    }

    setLoading(true);
    try {
      await api.post("/budgets", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
      onClose();
      setFormData(prev => ({ ...prev, category_id: "", amount: "" }));
    } catch (err) {
      alert("Gagal membuat budget: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Buat Budget Baru</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Pengeluaran</label>
            <select
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batas Nominal (Rp)</label>
            <input
              type="number"
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-800"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              placeholder="Contoh: 1000000"
            />
          </div>

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
                    className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:outline-blue-500"
                    value={formData.period_start}
                    onChange={e => setFormData({...formData, period_start: e.target.value})}
                />
                </div>
                <div>
                <label className="block text-xs font-semibold text-blue-600 mb-1">Selesai</label>
                <input
                    type="date"
                    required
                    className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:outline-blue-500"
                    value={formData.period_end}
                    onChange={e => setFormData({...formData, period_end: e.target.value})}
                />
                </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Simpan Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}