import { useState } from "react";
import * as XLSX from "xlsx";

export default function FinancialReports() {
  const [month, setMonth] = useState("Jan - Jun");
  const [search, setSearch] = useState("");

  const data = [
    { date: "02 Jan 2025", type: "Pemasukan", amount: "Rp 2.000.000", category: "Salary" },
    { date: "10 Jan 2025", type: "Pengeluaran", amount: "Rp 500.000", category: "Food" },
    { date: "25 Jan 2025", type: "Tabungan", amount: "Rp 1.000.000", category: "Saving" },
  ];

  const filteredData = data.filter(item =>
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
    XLSX.writeFile(workbook, `financial_report_${month}.xlsx`);
  };

  return (
    <div className="w-[88%] mt-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Financial Reports</h1>
        
        <button 
          onClick={exportToExcel}
          className="bg-[#1E88E5] hover:bg-[#1769AA] transition-all text-white px-6 py-3 rounded-xl font-medium shadow-md"
        >
          📄 Export Excel
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl shadow">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Cari transaksi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[40%] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
        />

        {/* Filter Month Dropdown */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-3 rounded-lg border text-black focus:ring-2 focus:ring-blue-300"
        >
          <option>Jan - Jun</option>
          <option>Jul - Dec</option>
          <option>Full Year</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="pb-3">Tanggal</th>
                <th className="pb-3">Tipe</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3 text-right">Jumlah</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="border-b last:border-none hover:bg-gray-50 transition">
                    <td className="py-4 text-black">{item.date}</td>
                    <td className={`font-semibold ${
                        item.type === "Pemasukan" ? "text-green-600" : 
                        item.type === "Pengeluaran" ? "text-red-500" : 
                        "text-blue-500"
                      }`}
                    >
                      {item.type}
                    </td>
                    <td className="text-black">{item.category}</td>
                    <td className="text-right font-semibold text-black">{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    Tidak ada data tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
