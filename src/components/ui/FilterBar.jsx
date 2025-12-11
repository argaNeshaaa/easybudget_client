import { LuFilter, LuArrowUp, LuArrowDown, LuList } from "react-icons/lu";

export default function FilterBar() {
  return (
    <div className=" w-[calc(100%-3rem)] px-6 py-8 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Filter & Pencarian</h2>
      <p className="text-gray-500 mb-6">Saring transaksi berdasarkan kriteria tertentu</p>

      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 flex items-center gap-2 border rounded-xl hover:bg-gray-100 transition">
          <LuList /> Semua
        </button>
        <button className="px-4 py-2 flex items-center gap-2 border rounded-xl hover:bg-gray-100 transition">
          <LuArrowUp /> Pemasukan
        </button>
        <button className="px-4 py-2 flex items-center gap-2 border rounded-xl hover:bg-gray-100 transition">
          <LuArrowDown /> Pengeluaran
        </button>

        {/* Dropdown placeholder */}
        <select className="px-4 py-2 border rounded-xl">
          <option>Wallet</option>
        </select>
      </div>

      {/* Bottom Filters */}
      <div className="flex flex-wrap gap-3 mt-5">
        <select className="px-4 py-2 border rounded-xl">
          <option>Tanggal</option>
        </select>
        <select className="px-4 py-2 border rounded-xl">
          <option>Semua Bulan</option>
        </select>
        <select className="px-4 py-2 border rounded-xl">
          <option>Semua Tahun</option>
        </select>
        <select className="px-4 py-2 border rounded-xl">
          <option>Kategori</option>
        </select>

        <button className="px-6 py-2 ml-auto bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl flex items-center gap-2">
          <LuFilter /> Filter
        </button>
      </div>
    </div>
  );
}
