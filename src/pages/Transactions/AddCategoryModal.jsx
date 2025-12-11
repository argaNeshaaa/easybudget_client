import { useState } from "react";
import { X, Save, Loader2, Tag } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
export default function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    type: "expense", // Default pengeluaran
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST ke /categories
      await api.post("/categories", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(); // Refresh data di parent (jika perlu)
      onClose();   // Tutup modal
      
      // Reset Form
      setFormData({
        name: "",
        type: "expense",
      });
      toast.success("Kategori berhasil ditambahkan!");

    } catch (err) {
      console.error("Gagal tambah kategori:", err);
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b border-gray-100 ${formData.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className={`text-xl font-bold ${formData.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
            Kategori {formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} Baru
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* TIPE SWICTHER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kategori</label>
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

          {/* NAMA KATEGORI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Contoh: Belanja Bulanan, Investasi, dll"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-black pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
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
              Simpan Kategori
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}