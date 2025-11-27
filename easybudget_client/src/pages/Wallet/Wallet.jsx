import { Sidebar, Header } from "../../components/ui/Navbar";
import "../../assets/styles/global.css";

function Wallet() {
    const wallets = [
    {
      name: "Credit Card",
      percent: 52,
      color: "bg-blue-500",
      iconBg: "bg-blue-500",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v3H2V7zm20 5v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5h20zm-7 3H7v2h8v-2z"/>
        </svg>
      ),
    },
    {
      name: "Cash",
      percent: 21,
      color: "bg-green-500",
      iconBg: "bg-green-500",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v12H4V6zm8 4a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
      ),
    },
    {
      name: "E Wallet",
      percent: 74,
      color: "bg-sky-500",
      iconBg: "bg-sky-500",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"></circle>
          <rect x="8" y="10" width="8" height="4" rx="1" fill="#fff"></rect>
        </svg>
      ),
    },
  ];
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[120vh] text-white flex items-center justify-start flex-col">
            {/* 11 */}
          <div className="w-full h-[35rem] flex flex-between items-center justify-between">
            <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] ml-[1rem]">
              <div className="w-full h-full p-6 flex">
  {/* LEFT: CREDIT CARD */}
  <div className="w-1/2 pr-6">
    {/* Title */}
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 8.25h19.5m-16.5 4.5h4.5m-4.5 3h3m-3-9h13.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 15.75v-7.5A2.25 2.25 0 014.5 6z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold ml-3">Credit Card</h2>
    </div>

    {/* Card */}
    <div className="w-[20rem] h-[13rem] rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 text-white p-5 shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">BCA</h3>
        <div className="text-right">
          <p className="text-sm">Blue</p>
          <p className="text-[0.6rem] tracking-wide">PREMIUM</p>
        </div>
      </div>

      <div className="mt-6 text-lg tracking-widest">
        5789 **** **** 2847
      </div>

      <div className="flex justify-between mt-5 text-sm">
        <div>
          <p className="opacity-80 text-xs">Valid Thru</p>
          <p>06/21</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Expired date</p>
          <p>06/21</p>
        </div>
      </div>

      <p className="mt-4 text-sm">Valentino</p>
    </div>

    {/* Slider navigation */}
    <div className="flex items-center justify-center mt-4 space-x-2 text-gray-400">
      <span className="text-sm">‹ Sebelumnya</span>
      <div className="flex space-x-1 mx-4">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
      </div>
      <span className="text-sm">Selanjutnya ›</span>
    </div>

    {/* Limit progress */}
    <div className="mt-5">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-2 bg-blue-600 rounded-full w-[20%]" /> {/* progress */}
      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Limit Harian</span>
        <span>Rp 100k / Rp 20Jt</span>
      </div>
    </div>
  </div>

  {/* RIGHT: BALANCE INFO */}
  <div className="w-1/2 pl-6 border-l">
    <div className="mb-6">
      <p className="text-3xl font-bold">Rp 6.000.000</p>
      <p className="text-gray-500 text-sm">Total Saldo Credit Card</p>

      <p className="text-xl font-semibold text-blue-600 mt-3">Rp 300.000</p>
      <p className="text-gray-500 text-sm">Saldo BCA</p>
    </div>

    <div className="w-full h-[1px] bg-gray-200 my-4"></div>

    {/* Currency & Status */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Currency</p>
        <p className="font-medium">Rupiah / Indonesian Rupiah</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-medium">Active</p>
      </div>
    </div>
  </div>
</div>
            </div>
<div className=" w-[50.7rem] h-[30rem] flex flex-col">

  {/* ================== TOP 4 BOX ================== */}
  <div className="w-full h-[50%] mt-[10px]">
    {/* Row 1 */}
    <div className="w-full h-[50%] flex items-start justify-between">
      
      {/* Total Saldo Wallet */}
      <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex">
        <div className="w-2 bg-blue-500 rounded-l-xl"></div>
        <div className="p-4">
          <p className="text-gray-500 text-lg">Total Saldo Wallet</p>
          <p className="text-2xl font-semibold text-[#0A1A2F] mt-2">Rp 11.000.000</p>
        </div>
      </div>

      {/* Tabungan */}
      <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex">
        <div className="w-2 bg-yellow-400 rounded-l-xl"></div>
        <div className="p-4">
          <p className="text-gray-500 text-lg">Tabungan</p>
          <p className="text-2xl font-semibold text-[#0A1A2F] mt-2">Rp 2.000.000</p>
        </div>
      </div>

    </div>

    {/* Row 2 */}
    <div className="w-full h-[50%] flex items-center justify-between">
      
      {/* Pemasukan */}
      <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex">
        <div className="w-2 bg-green-500 rounded-l-xl"></div>
        <div className="p-4">
          <p className="text-gray-500 text-lg">Pemasukan</p>
          <p className="text-2xl font-semibold text-[#0A1A2F] mt-2">Rp 15.000.000</p>
        </div>
      </div>

      {/* Pengeluaran */}
      <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex">
        <div className="w-2 bg-red-500 rounded-l-xl"></div>
        <div className="p-4">
          <p className="text-gray-500 text-lg">Pengeluaran</p>
          <p className="text-2xl font-semibold text-[#0A1A2F] mt-2">Rp 4.000.000</p>
        </div>
      </div>

    </div>
  </div>

  {/* ================== BOTTOM 2 BOX ================== */}
  <div className="w-full h-[50%] flex items-end justify-between mb-[10px]">

    {/* Cash */}
    <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-white rounded-xl shadow flex p-5">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M3 8l1.664 8.322A2 2 0 006.635 18H17.37a2 2 0 001.97-1.678L21 8M3 8h18M3 8l2-4h14l2 4" />
        </svg>
      </div>
      <div>
        <p className="text-xl font-semibold">Cash</p>
        <p className="text-2xl font-bold text-[#0A1A2F]">Rp 2.000.000</p>
        <p className="text-gray-400 text-sm">Total Saldo Cash</p>
      </div>
    </div>

    {/* E Wallet */}
    <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-white rounded-xl shadow flex p-5">
      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </div>
      <div>
        <p className="text-xl font-semibold">E Wallet</p>
        <p className="text-2xl font-bold text-[#0A1A2F]">Rp 3.000.000</p>
        <p className="text-gray-400 text-sm">Total Saldo E Wallet</p>
      </div>
    </div>

  </div>
</div>
          </div>
          {/* 2 */}
          <div className="w-full h-[35rem] flex flex-between items-center justify-between">
            <div className="dashboard-card w-[60rem] h-[30rem] bg-[#ffffff] ml-[1rem] p-6 rounded-lg shadow">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">Statistik</h1>
    <div className="flex items-center gap-2 cursor-pointer">
      <span className="text-gray-700 font-medium">Grafik Jan-Jun</span>
      <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.082l3.71-3.85a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
      </svg>
    </div>
  </div>

  <div className="flex justify-end mt-2 gap-6 mr-3">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
      <span className="text-gray-700">Pendapatan</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
      <span className="text-gray-700">Pengeluaran</span>
    </div>
  </div>

  <div className="w-full h-[20rem] flex items-end gap-8 pb-4 pl-4">
    
    <div className="flex flex-col justify-between h-full text-gray-400 text-sm pt-1">
      <span>10Jt</span>
      <span>8Jt</span>
      <span>6Jt</span>
      <span>4Jt</span>
      <span>2Jt</span>
      <span>0</span>
    </div>

    <div class="flex justify-around items-end w-full">

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[6rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[9.5rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Jan</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[4.5rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[5rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Feb</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[6rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[3.5rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Mar</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[6rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[6.5rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Apr</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[5rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[6.5rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Mei</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-2 items-end">
          <div class="w-6 bg-red-500 h-[3rem] rounded"></div>
          <div class="w-6 bg-green-500 h-[9rem] rounded"></div>
        </div>
        <span class="mt-2 text-gray-700">Jun</span>
      </div>

    </div>
  </div>
</div>
            <div className="dashboard-card w-[40rem] h-[30rem] bg-[#ffffff] mr-[1rem] p-6 rounded-lg shadow">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Statistik Pengeluaran Setiap Wallet
      </h1>

      {/* List */}
      <div className="flex flex-col gap-10">

        {wallets.map((w, i) => (
          <div key={i} className="flex items-center gap-4">

            {/* Icon */}
            <div className={`w-12 h-12 ${w.iconBg} rounded-full flex items-center justify-center`}>
              {w.icon}
            </div>

            {/* Progress Area */}
            <div className="flex-1">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-3 ${w.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${w.percent}%` }}
                ></div>
              </div>
              <span className="text-gray-500 mt-1 block">{w.name}</span>
            </div>

            {/* Percentage */}
            <span className="text-xl font-semibold text-gray-700">{w.percent}%</span>

          </div>
        ))}

      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
