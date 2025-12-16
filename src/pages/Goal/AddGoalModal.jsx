import { useState } from "react";
import { X, Save, Loader2, Target, Calendar } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
export default function AddGoalModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    current_amount: "", // Optional initial amount
    deadline: "",
  });

  // Helper format rupiah input
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
          ...formData,
          target_amount: formData.target_amount.replace(/\./g, ""),
          current_amount: formData.current_amount ? formData.current_amount.replace(/\./g, "") : 0
      };

      await api.post("/goals", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tambah Goal Berhasil!");
      onSuccess();
      onClose();
      setFormData({ name: "", target_amount: "", current_amount: "", deadline: "" });
    } catch (err) {
      toast.error("Gagal membuat goal: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Buat Target Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Target</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    required
                    className="w-full text-black pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Beli iPhone 15"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Dana (Rp)</label>
            <div className="flex items-center border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden transition">
                <div className="bg-gray-50 px-4 py-3 text-gray-500 font-semibold border-r border-gray-200">Rp</div>
                <input
                    type="text"
                    required
                    className="w-full text-black p-3 outline-none font-semibold text-gray-800"
                    value={formData.target_amount}
                    onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({...formData, target_amount: val ? formatNumber(val) : ""});
                    }}
                    placeholder="0"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saldo Awal (Opsional)</label>
                <input
                    type="text"
                    className="w-full text-black p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.current_amount}
                    onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({...formData, current_amount: val ? formatNumber(val) : ""});
                    }}
                    placeholder="0"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                    type="date"
                    required
                    className="w-full text-black p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
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