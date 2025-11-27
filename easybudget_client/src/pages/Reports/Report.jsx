
import { Sidebar, Header } from "../../components/ui/Navbar";
import FinancialReports from "./FinancialReports";
import "../../assets/styles/global.css";
function Report() {
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
        <Sidebar />
        <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[147vh] text-white flex items-center justify-start flex-col">
          <FinancialReports />
        </div>
      </div>
    </div>
  );
}

export default Report;
