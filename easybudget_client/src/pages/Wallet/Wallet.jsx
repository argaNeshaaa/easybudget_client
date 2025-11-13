import { Sidebar, Header } from "../../components/ui/Navbar";
import "../../assets/styles/global.css";

function Wallet() {
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[120vh] text-white flex items-center justify-start flex-col">
            {/* 11 */}
          <div className="w-full h-[35rem] flex flex-between items-center justify-between">
            <div className="dashboard-card w-[40rem] h-[30rem] bg-[#ffffff] ml-[1rem]"></div>
            <div className=" w-[40rem] h-[30rem] flex flex-col">
              <div className="w-full h-[50%]">
                <div className="w-full h-[50%] flex items-start justify-between">
                  <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-[#ffffff]"></div>
                  <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-[#ffffff]"></div>
                </div>
                <div className="w-full h-[50%]  flex items-center justify-between">
                  <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-[#ffffff]"></div>
                  <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-[#ffffff]"></div>
                </div>
              </div>
              <div className="w-full h-[50%] flex items-end justify-between">
                <div className="dashboard-card w-[45%] h-[90%] ml-[1rem] bg-[#ffffff]"></div>
                <div className="dashboard-card w-[45%] h-[90%] mr-[1rem] bg-[#ffffff]"></div>
              </div>
            </div>
          </div>
          {/* 2 */}
          <div className="w-full h-[35rem] flex flex-between items-center justify-between">
            <div className="dashboard-card w-[45rem] h-[30rem] bg-[#ffffff] ml-[1rem]"></div>
            <div className="dashboard-card w-[35rem] h-[30rem] bg-[#ffffff] mr-[1rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
