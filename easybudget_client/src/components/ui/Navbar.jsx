import { useEffect, useState } from "react";
import dashboardIcon from "../../assets/icons/bar-chart-2.svg"
import logo from "../../../public/favicon_white.svg";
import walletIcon from "../../assets/icons/wallet.svg"
import transactionIcon from "../../assets/icons/transaction.svg"
import budgetIcon from "../../assets/icons/budget.svg"
import goalsIcon from "../../assets/icons/goals.svg"
import reportIcon from "../../assets/icons/report.svg"
import userIcon from "../../assets/icons/user.svg"
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
export function Sidebar () {
    return (
              <div className="fixed top-0 left-0 w-[18%] h-full bg-[#15213F] z-30">
        <div className="w-full h-[10%] flex items-center justify-center">
          <img src={logo} alt="logo" className="w-[2rem]" />
          <h1 className="text-white font-gabarito font-bold text-[2rem] ml-[1rem]">
            Easy Budget
          </h1>
        </div>
        <a
          href="/dashboard"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={dashboardIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Dashboard</p>
          </div>
        </a>
        <a
          href="/wallet"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={walletIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Wallet</p>
          </div>
        </a>
        <a
          href="/transaction"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={transactionIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Transaction</p>
          </div>
        </a>
        <a
          href="/budget"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={budgetIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Budget Planning</p>
          </div>
        </a>
        <a
          href="/goal"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={goalsIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Goals</p>
          </div>
        </a>
        <a
          href="/report"
          className="w-full h-[7%] flex items-center justify-center"
        >
            <div className="h-full w-[60%] flex items-center">
          <img
            src={reportIcon}
            alt="logo"
            className="w-[1.5rem] text-white"
          />
          <p className="ml-[2rem]">Financial Reports</p>
          </div>
        </a>
        
      </div>
    )
}

export function Header() {
  
      const navigate = useNavigate();
      const location = useLocation();
      const auth = useAuth(); // hasil decode token
      const [userData, setUserData] = useState(null);
      const token = localStorage.getItem("token");
        const pageTitles = {
    "/dashboard": "Dashboard",
    "/wallet": "Wallet",
    "/transaction": "Transaction",
    "/budget": "Budget Planning",
    "/goal": "Goal",
    "/report": "Financial Reports",
  };

  const currentTitle = pageTitles[location.pathname] || "Easy Budget";

    useEffect(() => {
    const fetchUser = async () => {
      if (!auth?.user_id) return; // token invalid / belum login

      try {
        const res = await api.get(`/users/${auth.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUserData(res.data.data);
      } catch (error) {
        console.error("Failed fetch user:", error);
      }
    };

    fetchUser();
  }, []);

    return (
        <div className="fixed top-0 left-[18%] w-[82%] h-[10%] bg-[ffffff] z-20 flex font-bold text-lg text-black">
        <div className="w-[80%] h-full flex items-center font-gabarito font-bold text-[2rem] pl-[1rem]">
          <h1>{currentTitle}</h1>
        </div>
        <div className="w-[20%] h-full">
            <div className="w-full h-full flex items-center justify-end">
            <button onClick={() => navigate("/profile")} className="w-[4.5rem] h-[4.5rem] cursor-pointer bg-[skyblue] rounded-full mr-[3rem] flex items-center justify-center overflow-hidden">
                <img src={userData?.photo_url} alt="User" className=" w-full h-full object-cover rounded-full" />
            </button>
            </div>
        </div>
      </div>
    )
}