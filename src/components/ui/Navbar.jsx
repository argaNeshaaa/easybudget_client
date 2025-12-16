import { useEffect, useState } from "react";
// Imports untuk Icons (Pastikan path sesuai)
import dashboardIcon from "../../assets/icons/bar-chart-2.svg";
import logo from "../../../public/favicon_white.svg";
import walletIcon from "../../assets/icons/wallet.svg";
import transactionIcon from "../../assets/icons/transaction.svg";
import budgetIcon from "../../assets/icons/budget.svg";
import goalsIcon from "../../assets/icons/goals.svg";
import reportIcon from "../../assets/icons/report.svg";
import pesanIcon from "../../assets/icons/message-circle.svg";
import userIcon from "../../assets/icons/user.svg";
// Imports dari Library
import { LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import ProfileModal from "../../pages/Profile/ProfileModal";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";

// --- KOMPONEN SIDEBAR (Tetap sama, hanya tampil di Desktop) ---
export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
        Swal.fire({
          icon: "success",
          title: "Logout Berhasil",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const getMenuClass = (path) => {
    const isActive = location.pathname === path;
    return `w-full py-4 flex items-center justify-center border-l-4 ${
      isActive
        ? "bg-[#1e2d50] border-blue-500"
        : "border-transparent hover:bg-[#1e2d50] hover:border-gray-600"
    }`;
  };

  return (
    <div className="hidden lg:flex fixed top-0 left-0 w-[18%] h-full bg-[#15213F] z-30 flex-col justify-between pb-6">
      {/* BAGIAN ATAS: LOGO & MENU */}
      <div className="w-full">
        <div className="w-full h-[10vh] flex items-center justify-center mb-4">
          <img src={logo} alt="logo" className="w-[2rem]" />
          <h1 className="text-white font-gabarito font-bold text-[1.8rem] ml-[0.8rem]">
            Easy Budget
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          <Link to="/dashboard" className={getMenuClass("/dashboard")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={dashboardIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Dashboard
              </p>
            </div>
          </Link>

          <Link to="/wallet" className={getMenuClass("/wallet")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={walletIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Wallet
              </p>
            </div>
          </Link>

          <Link to="/transaction" className={getMenuClass("/transaction")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={transactionIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Transaction
              </p>
            </div>
          </Link>

          <Link to="/budget" className={getMenuClass("/budget")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={budgetIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Budget Planning
              </p>
            </div>
          </Link>

          <Link to="/goal" className={getMenuClass("/goal")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={goalsIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Goals
              </p>
            </div>
          </Link>

          <Link to="/report" className={getMenuClass("/report")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={reportIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Financial Reports
              </p>
            </div>
          </Link>

          <Link to="/ai" className={getMenuClass("/ai")}>
            <div className="h-full w-[60%] flex items-center">
              <img
                src={pesanIcon}
                alt="icon"
                className="w-[1.5rem] text-white"
              />
              <p className="ml-[1.5rem] text-white text-sm font-medium">
                Tanya Nathan
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* BAGIAN BAWAH: LOGOUT */}
      <div className="w-full">
        <button
          onClick={handleLogout}
          className="w-full py-4 flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <div className="h-full w-[60%] flex items-center">
            <LogOut className="w-[1.5rem] text-gray-400 group-hover:text-red-400 transition-colors" />
            <p className="ml-[1.5rem] text-gray-400 text-sm font-medium group-hover:text-red-400 transition-colors">
              Log Out
            </p>
          </div>
        </button>

        <div className="text-center mt-4 text-[10px] text-gray-600">
          Easy Budget v1.0.0
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN HEADER (Updated Mobile Menu Style) ---
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/wallet": "Wallet",
    "/transaction": "Transaction",
    "/budget": "Budget Planning",
    "/goal": "Goals",
    "/report": "Financial Reports",
    "/ai": "Tanya AI",
  };

  const currentTitle = pageTitles[location.pathname] || "Easy Budget";

  const handleLogoutMobile = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    if (!auth?.user_id) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${auth.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.data);
      } catch (error) {
        console.error("Failed fetch user:", error);
      }
    };

    if (token) fetchUser();
  }, [auth?.user_id, token]);

  // Style Helper untuk Tombol Menu
  const getMobileMenuClass = (path) => {
    const isActive = location.pathname === path;
    // Sedikit penyesuaian padding agar pas di layar yang lebih sempit
    const baseClass =
      "w-full py-3 px-4 flex items-center rounded-2xl transition-all duration-200 mb-2 border";

    if (isActive) {
      return `${baseClass} bg-[#2d3b5e] border-blue-500 text-white shadow-md`;
    } else {
      return `${baseClass} bg-white/5 border-transparent text-gray-300 hover:bg-white/10 hover:text-white`;
    }
  };

  return (
    <>
      {/* HEADER BAR (Z-50: Paling Atas) */}
      <div className="fixed top-0 left-0 lg:left-[18%] w-full lg:w-[82%] h-[5rem] lg:h-[10%] bg-white z-50 flex items-center justify-between px-4 sm:px-8 shadow-sm border-b border-gray-100">
        {/* Title */}
        <div className="font-gabarito font-bold flex text-xl sm:text-2xl lg:text-[2rem] text-gray-800 truncate">
          <h1>{currentTitle}</h1>
        </div>

        {/* Right Section */}
        <div className="h-full flex items-center gap-3 sm:gap-4">
          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem] cursor-pointer rounded-full overflow-hidden border-2 border-gray-100 hover:border-blue-500 transition shadow-sm"
          >
            <img
              src={userData?.photo_url || "https://via.placeholder.com/150"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Hamburger Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {isMobileMenuOpen && (
        <>
          {/* 1. BACKDROP / OVERLAY (Lapisan Gelap Transparan) */}
          {/* - fixed inset-0: Menutupi seluruh layar.
                - top-[5rem]: Mulai dari bawah header.
                - bg-black/60: Warna hitam dengan opasitas 60%.
                - z-30: Di bawah menu drawer, tapi di atas konten dashboard.
                - onClick: Menutup menu jika area gelap ini diklik.
            */}
          <div
            className="fixed inset-0 top-[5rem] bg-black/60 z-30 lg:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* 2. MENU DRAWER CONTAINER (Setengah Lebar) */}
          {/* - w-[60%] sm:w-[50%]: Lebar 60% di HP kecil, 50% di tablet/HP besar.
                - shadow-2xl: Memberi bayangan agar terpisah visual dari backdrop.
                - z-40: Di atas backdrop.
            */}
          <div className="fixed top-[5rem] left-0 w-[60%] sm:w-[50%] h-[calc(100vh-5rem)] bg-[#15213F] z-40 lg:hidden overflow-y-auto shadow-2xl transition-transform">
            <div className="p-4 flex flex-col pb-20">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/dashboard")}
              >
                {/* Tambahkan filter brightness-0 invert agar icon dashboard (jika hitam) menjadi putih */}
                <img
                  src={dashboardIcon}
                  className="w-5 h-5 mr-3 brightness-0 invert"
                  alt="icon"
                />
                <span className="font-medium text-sm sm:text-base">
                  Dashboard
                </span>
              </Link>

              <Link
                to="/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/wallet")}
              >
                <img src={walletIcon} className="w-5 h-5 mr-3" alt="icon" />
                <span className="font-medium text-sm sm:text-base">Wallet</span>
              </Link>

              <Link
                to="/transaction"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/transaction")}
              >
                <img
                  src={transactionIcon}
                  className="w-5 h-5 mr-3"
                  alt="icon"
                />
                <span className="font-medium text-sm sm:text-base">
                  Transaction
                </span>
              </Link>

              <Link
                to="/budget"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/budget")}
              >
                <img src={budgetIcon} className="w-5 h-5 mr-3" alt="icon" />
                <span className="font-medium text-sm sm:text-base">
                  Budget Planning
                </span>
              </Link>

              <Link
                to="/goal"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/goal")}
              >
                <img src={goalsIcon} className="w-5 h-5 mr-3" alt="icon" />
                <span className="font-medium text-sm sm:text-base">Goals</span>
              </Link>

              <Link
                to="/report"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/report")}
              >
                <img src={reportIcon} className="w-5 h-5 mr-3" alt="icon" />
                <span className="font-medium text-sm sm:text-base">
                  Financial Reports
                </span>
              </Link>

              <Link
                to="/ai"
                onClick={() => setIsMobileMenuOpen(false)}
                className={getMobileMenuClass("/ai")}
              >
                <img src={pesanIcon} className="w-5 h-5 mr-3" alt="icon" />
                <span className="font-medium text-sm sm:text-base">
                  Tanya Nathan
                </span>
              </Link>

              <div className="my-2 border-t border-gray-700/50"></div>

              <button
                onClick={handleLogoutMobile}
                className="w-full py-3 px-4 flex items-center rounded-2xl bg-red-500/10 border border-transparent text-red-400 hover:bg-red-500/20 transition-all duration-200 mt-2"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm sm:text-base">
                  Log Out
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
