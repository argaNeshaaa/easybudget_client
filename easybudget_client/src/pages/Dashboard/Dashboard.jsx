
import { Sidebar, Header } from "../../components/ui/Navbar";
import "../../assets/styles/global.css";
function Dashboard() {
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
        <Sidebar />
        <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[147vh] text-white flex items-center justify-start flex-col">
            <div className="w-full h-[15rem] flex flex-between items-center justify-between">
                <div className="dashboard-card w-[18rem] h-[10rem] bg-[#ffffff] ml-[1rem]"></div>
                <div className="dashboard-card w-[18rem] h-[10rem] bg-[#ffffff]"></div>
                <div className="dashboard-card w-[18rem] h-[10rem] bg-[#ffffff]"></div>
                <div className="dashboard-card w-[18rem] h-[10rem] bg-[#ffffff] mr-[1rem]"></div>
            </div>
            <div className="w-full h-[35rem] flex flex-between items-center justify-between">
                <div className="dashboard-card w-[40rem] h-[30rem] bg-[#ffffff] ml-[1rem]"></div>
                <div className="dashboard-card w-[40rem] h-[30rem] bg-[#ffffff] mr-[1rem]"></div>
            </div>
            <div className="w-full h-[35rem] flex flex-between items-center justify-center">
                <div className="dashboard-card w-[85rem] h-[30rem] bg-[#ffffff] ml-[1rem] mr-[1rem]"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
