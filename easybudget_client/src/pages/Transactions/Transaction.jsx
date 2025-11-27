import { Sidebar, Header } from "../../components/ui/Navbar";
import "../../assets/styles/global.css";
import { TransactionsCards } from "../../components/ui/TransactionsCards";
import FilterBar from "../../components/ui/FilterBar";
function Transaction() {
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-[100vh] w-full text-white flex items-center justify-start flex-col">
            {/* 11 */}
                <TransactionsCards />
                <FilterBar />
        </div>
      </div>
    </div>
  );
}

export default Transaction;
