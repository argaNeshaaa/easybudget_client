import { useState } from "react";
import { X, Loader2, Banknote } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
export default function AddMoneyModal({ isOpen, onClose, onSuccess, goalData }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount === "0") return;

    setLoading(true);
    try {
      // Panggil Endpoint khusus: POST /goals/:id/add-money
      await api.post(`/goals/${goalData.goal_id}/add-money`, {
        amount: amount.replace(/\./g, "")
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Isi Tabungan Berhasil!");
      onSuccess();
      onClose();
      setAmount("");
    } catch (err) {
      toast.error("Gagal menambah tabungan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !goalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
             <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Menabung Untuk</p>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{goalData.name}</h3>
             </div>
             <button onClick={onClose} className="p-1 bg-white rounded-full hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
            <label className="block text-sm text-gray-600 mb-3 font-medium text-center">Berapa yang ingin ditabung?</label>
            
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Banknote className="text-green-600" size={24} />
                </div>
                <input
                    type="text"
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-0 outline-none text-center transition"
                    placeholder="0"
                    value={amount}
                    onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setAmount(val ? formatNumber(val) : "");
                    }}
                />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                {[50000, 100000, 500000].map(val => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(formatNumber(val))}
                        className="py-2 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200 transition"
                    >
                        + {val/1000}k
                    </button>
                ))}
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Simpan Tabungan"}
            </button>
        </form>
      </div>
    </div>
  );
}