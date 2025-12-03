import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function EditAccountModal({ isOpen, onClose, onSuccess, accountData }) {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const token = localStorage.getItem("token");

  // State Form
  const [formData, setFormData] = useState({
    wallet_id: "",
    account_name: "",
    account_number: "",
    account_type: "bank",
    balance: "",
  });

  // Helper decode token (sama seperti sebelumnya)
  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload).user_id;
    } catch (error) {
      return null;
    }
  };

  // 1. Fetch Wallets (Agar dropdown bisa dipilih/diubah)
  useEffect(() => {
    if (isOpen && token) {
      const fetchWallets = async () => {
        try {
          const userId = getUserIdFromToken(token);
          if (!userId) return;
          const res = await api.get(`/wallets/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWallets(res.data.data);
        } catch (err) {
          console.error("Gagal ambil wallet:", err);
        }
      };
      fetchWallets();
    }
  }, [isOpen, token]);

  // 2. 🔥 POPULATE DATA (Isi form dengan data lama saat modal dibuka)
  useEffect(() => {
    if (isOpen && accountData) {
      setFormData({
        wallet_id: accountData.wallet_id || "", // Pastikan backend kirim wallet_id di /stats, jika tidak default ke yang ada
        account_name: accountData.account_name,
        account_number: accountData.account_number,
        account_type: accountData.account_type,
        balance: accountData.balance,
      });
    }
  }, [isOpen, accountData]);

  // 3. Logic Tipe Akun (Cash = Disable Nomor)
  useEffect(() => {
    if (formData.account_type === "cash") {
      setFormData((prev) => ({ ...prev, account_number: "-" }));
    }
  }, [formData.account_type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PATCH ke endpoint /accounts/:id (Gunakan account_id)
      await api.patch(`/accounts/${accountData.account_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(); // Refresh data di parent
      onClose();
    } catch (err) {
      console.error("Gagal update akun:", err);
      alert(err.response?.data?.message || "Gagal mengupdate akun");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCash = formData.account_type === "cash";
  const isEwallet = formData.account_type === "ewallet";
  let numberLabel = "Nomor Rekening";
  if (isEwallet) numberLabel = "Nomor HP / E-Wallet";
  if (isCash) numberLabel = "Nomor (Tidak perlu)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit Akun</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Wallet</label>
            <select
              name="wallet_id"
              value={formData.wallet_id}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>-- Pilih Wallet --</option>
              {wallets.map((w) => (
                <option key={w.wallet_id} value={w.wallet_id}>
                  {w.name} ({w.type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="bank">Bank</option>
                <option value="ewallet">E-Wallet</option>
                <option value="cash">Cash / Tunai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{numberLabel}</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              required
              disabled={isCash}
              className={`w-full p-3 border rounded-xl focus:outline-none transition ${isCash ? "bg-gray-200 cursor-not-allowed" : "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Saat Ini (Rp)</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-red-500 mt-1">*Mengubah saldo secara manual akan mempengaruhi total aset tanpa tercatat di riwayat transaksi.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}