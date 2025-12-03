import { Sidebar, Header } from "../../components/ui/Navbar";
import WeeklyChart from "./GrafikMingguan";
import DashboardCards from "./DashboardCards";
import MonthlyChart from "./MonthlyChart";
import OverviewTransactions from "./OverviewTransactions";
import "../../assets/styles/global.css";

function Dashboard() {

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito flex">
      <Sidebar />
      <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-auto bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-max text-white flex items-center justify-start flex-col">
          
          {/* BAGIAN ATAS - DASHBOARD CARDS */}
          <div className="w-full h-max flex flex-between items-center justify-between mt-[1rem] mb-[1rem]">
            {/* Tidak perlu kirim props income/expense lagi */}
            <DashboardCards />
          </div>

          <div className="w-full h-max flex flex-between items-center justify-between mt-[1rem] mb-[1rem]">
             {/* ... KONTEN GRAFIK MINGGUAN & PERSENTASE (Biarkan seperti sebelumnya) ... */}
             {/* ... Jika grafik ini butuh data, sebaiknya buat komponen terpisah juga ... */}
             <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] ml-[1rem] p-6 rounded-xl flex flex-col items-center justify-center text-gray-500 ">
                <WeeklyChart />
             </div>
             
             <div className="dashboard-card w-[50.7rem] h-[30rem] bg-[#ffffff] mr-[1rem] p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-gray-500">
                <MonthlyChart />
             </div>
          </div>

          {/* BAGIAN BAWAH - OVERVIEW */}
          <div className="w-full h-max flex flex-between items-center justify-center mt-[1rem] mb-[1rem]">
             {/* ... KONTEN OVERVIEW ... */}
             <div className="dashboard-card w-full h-[30rem]  bg-[#ffffff] ml-[1rem] mr-[1rem] p-6 rounded-xl shadow-md">
             <OverviewTransactions />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;