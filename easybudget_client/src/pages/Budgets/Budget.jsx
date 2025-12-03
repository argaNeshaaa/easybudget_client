import { useState } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";

export default function Budget() {
  const transactionCategories = [
    "Makanan/Minuman",
    "Pakaian",
    "Bensin",
    "Kesehatan",
    "Hiburan",
  ];

  // contoh data awal supaya list tidak kosong
  const [budgets, setBudgets] = useState([
    { id: 1, name: "Makanan/Minuman", spent: 1000000, limit: 2000000 },
    { id: 2, name: "Pakaian", spent: 1200000, limit: 2000000 },
    { id: 3, name: "Bensin", spent: 1900000, limit: 2000000 },
  ]);

  const [editData, setEditData] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  
  const [newBudget, setNewBudget] = useState({
    name: "",
    limit: "", 
  });

  
  const usedCategories = budgets.map((b) => b.name);
  const availableCategories = transactionCategories.filter(
    (cat) => !usedCategories.includes(cat)
  );
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  const getBarColor = (percent) => {
    if (percent <= 40) return "bg-green-500";
    if (percent <= 80) return "bg-blue-500";
    return "bg-red-500";
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleUpdate = () => {
    const cleanLimit = Number(editData.limit.toString().replace(/\./g, "")); 

    if (!editData.name || !cleanLimit || cleanLimit <= 0) return;

    setBudgets((prev) =>
      prev.map((b) => (b.id === editData.id ? { ...editData, limit: cleanLimit } : b))
    );
    setEditData(null);
  };

  const handleAdd = () => {
    const cleanLimit = Number(newBudget.limit.replace(/\./g, ""));

    if (!newBudget.name || !cleanLimit || cleanLimit <= 0) return;

    if (usedCategories.includes(newBudget.name)) {
        alert(`Kategori "${newBudget.name}" sudah memiliki budget.`);
        return;
    }

    setBudgets((prev) => [
      ...prev,
      { id: Date.now(), name: newBudget.name, spent: 0, limit: cleanLimit },
    ]);

    setNewBudget({ name: "", limit: "" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] p-8 overflow-y-auto rounded-lg">
        <div className="relative bg-white w-full p-8 rounded-2xl shadow-lg">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Budget</h1>
            <p className="text-black text-[32px] font-bold mt-1">
              Budget {currentMonth}, {currentYear}
            </p>
          </div>

          {/* List budget */}
          <div className="mt-8 space-y-8 pb-24">
            {budgets.map((item) => {
              const percent = Math.round((item.spent / item.limit) * 100);
              const barColor = getBarColor(percent);

              const categoryIcons = {
                "Makanan/Minuman": { icon: "🍔", color: "bg-blue-500" },
                Pakaian: { icon: "👕", color: "bg-green-500" },
                Bensin: { icon: "⛽", color: "bg-blue-400" },
                Kesehatan: { icon: "🏥", color: "bg-red-400" },
                Hiburan: { icon: "🎬", color: "bg-purple-400" },
                "Lainnya": { icon: "💰", color: "bg-gray-400" },
              };

              const category =
                categoryIcons[item.name] || { icon: "💰", color: "bg-gray-400" };

              return (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-[20px] shadow-md hover:shadow-lg transition-shadow bg-white flex items-center gap-6"
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl ${category.color}`}
                  >
                    {category.icon}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-black">{item.name}</h2>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`${barColor} h-full rounded-full`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-black font-semibold">{percent}%</span>
                    </div>

                    <div className="text-black mt-1">
                      Rp {item.spent.toLocaleString()} / Rp {item.limit.toLocaleString()}
                    </div>
                  </div>

                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-[10px] shadow hover:bg-blue-600 transition-colors duration-300 font-semibold"
                    onClick={() => setEditData({ ...item, limit: formatNumber(item.limit) })}
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={() => setShowAdd(true)}
            className="absolute bottom-6 right-6 px-6 py-3 bg-blue-500 text-white rounded-[10px] shadow-lg hover:bg-blue-600 transition-colors duration-300 font-semibold select-none"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[25rem] rounded-xl">
            {/* Judul Modal Edit: Hitam & Tengah */}
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Edit Budget</h2>

            {/* Nama Kategori (Label teks hitam, input rounded-2xl) */}
            <label className="block mb-2 text-black font-medium">Nama Kategori</label>
            <input
              className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4 text-black cursor-not-allowed bg-gray-50"
              value={editData.name}
              disabled
              readOnly
            />

            {/* Batas Bulanan (Label teks hitam, input rounded-2xl) */}
            <label className="block mb-2 text-black font-medium">Batas Bulanan (Rp)</label>
             {/* Input Group untuk Batas Bulanan di Modal Edit */}
            <div className="mb-4">
              <div className="flex items-center border-2 border-gray-300 rounded-2xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden bg-white">
                <div className="bg-gray-100 text-black px-4 py-3 font-semibold border-r border-gray-300">
                  Rp
                </div>
                <input
                  type="text"
                  placeholder="0"
                  className="w-full p-3 outline-none text-black" 
                  value={editData.limit}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^0-9]/g, "");
                    const formattedValue = numericValue ? formatNumber(numericValue) : "";
                    
                    setEditData({ ...editData, limit: formattedValue });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                // Tombol Batal: text-blue-500 dan bg-gray-200
                className="px-4 py-2 bg-gray-200 text-blue-500 rounded font-semibold transition-colors duration-300 hover:bg-gray-300"
                onClick={() => setEditData(null)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-[10px] shadow hover:bg-blue-600 transition-colors duration-300 font-semibold"
                onClick={handleUpdate}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH --- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[26rem] rounded-xl shadow-lg">
            {/* Judul di tengah & hitam */}
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Tambah Budget Baru
            </h2>

            {/* Dropdown Kategori (Label teks hitam, input rounded-2xl) */}
            <div className="mb-4">
              <label className="block text-black font-medium mb-1">Kategori</label>
              <select
                // Tambahkan kelas untuk membuat dropdown bisa di-scroll
                className="w-full p-3 border-2 border-gray-300 rounded-2xl bg-white focus:border-blue-500 focus:outline-blue-500 appearance-none text-black max-h-40 overflow-y-auto"
                value={newBudget.name}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, name: e.target.value })
                }
              >
                <option value="" disabled className="text-gray-500">-- Pilih Kategori --</option>
                {/* Menggunakan transactionCategories (daftar lengkap) */}
                {transactionCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget dengan Rp dan Formatting (Label teks hitam, input rounded-2xl) */}
            <div className="mb-4">
              <label className="block text-black font-medium mb-1">
                Max Budget (Rp)
              </label>
              
              <div className="flex items-center border-2 border-gray-300 rounded-2xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden bg-white">
                {/* Bagian Tulisan Rp (Statis) - teks hitam */}
                <div className="bg-gray-100 text-black px-4 py-3 font-semibold border-r border-gray-300">
                  Rp
                </div>

                {/* Input Angka */}
                <input
                  type="text" 
                  placeholder="0"
                  className="w-full p-3 outline-none text-black"
                  value={newBudget.limit}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/[^0-9]/g, "");
                    const formattedValue = numericValue ? formatNumber(numericValue) : "";
                    
                    setNewBudget({ ...newBudget, limit: formattedValue });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                // Tombol Batal: text-blue-500 dan bg-gray-200
                className="px-4 py-2 bg-gray-200 text-blue-500 rounded-lg font-semibold transition-colors duration-300 hover:bg-gray-300"
                onClick={() => {
                  setShowAdd(false);
                  setNewBudget({ name: "", limit: "" });
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 font-medium"
                onClick={handleAdd}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}