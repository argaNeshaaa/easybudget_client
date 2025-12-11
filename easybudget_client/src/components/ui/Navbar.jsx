import { useEffect, useState } from "react";
import dashboardIcon from "../../assets/icons/bar-chart-2.svg"; // Sesuaikan path
import logo from "../../../public/favicon_white.svg"; // Sesuaikan path
import walletIcon from "../../assets/icons/wallet.svg"; // Sesuaikan path
import transactionIcon from "../../assets/icons/transaction.svg"; // Sesuaikan path
import budgetIcon from "../../assets/icons/budget.svg"; // Sesuaikan path
import goalsIcon from "../../assets/icons/goals.svg"; // Sesuaikan path
import reportIcon from "../../assets/icons/report.svg"; // Sesuaikan path
import pesanIcon from "../../assets/icons/message-circle.svg"; // Sesuaikan path
import userIcon from "../../assets/icons/user.svg"; // Sesuaikan path
import { LogOut } from "lucide-react";
import { memo } from 'react';
import Swal from "sweetalert2";
import ProfileModal from "../../pages/Profile/ProfileModal";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Sesuaikan path
import api from "../../api/axios"; // Sesuaikan path

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Anda akan keluar dari sesi ini.",
    icon: 'warning',
    showCancelButton: true, // Menampilkan tombol kedua (Batal)
    confirmButtonColor: '#d33', // Warna merah untuk tombol 'Ya'
    cancelButtonColor: '#3085d6', // Warna biru untuk tombol 'Batal'
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    // Cek tombol mana yang ditekan
    if (result.isConfirmed) {
      // Aksi jika tombol "Ya, Keluar" ditekan
      localStorage.removeItem("token");
      navigate("/login");
      
      Swal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: false,
        showConfirmButton: false, // Hilangkan tombol
        timer: 2000, // Hilang otomatis setelah 2 detik
      })
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  })
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
    <div className="fixed top-0 left-0 w-[18%] h-full bg-[#15213F] z-30 flex flex-col justify-between pb-6">
      
      {/* BAGIAN ATAS: LOGO & MENU */}
      <div className="w-full">
        {/* Logo */}
        <div className="w-full h-[10vh] flex items-center justify-center mb-4">
          <img src={logo} alt="logo" className="w-[2rem]" />
          <h1 className="text-white font-gabarito font-bold text-[1.8rem] ml-[0.8rem]">
            Easy Budget
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1">
            <Link to="/dashboard" className={`w-full py-4 flex items-center justify-center transition-colors  ${getMenuClass("/dashboard")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={dashboardIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Dashboard</p>
            </div>
            </Link>
            
            <Link to="/wallet" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/wallet")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={walletIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Wallet</p>
            </div>
            </Link>

            <Link to="/transaction" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/transaction")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={transactionIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Transaction</p>
            </div>
            </Link>

            <Link to="/budget" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/budget")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={budgetIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Budget Planning</p>
            </div>
            </Link>

            <Link to="/goal" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/goal")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={goalsIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Goals</p>
            </div>
            </Link>

            <Link to="/report" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/report")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={reportIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Financial Reports</p>
            </div>
            </Link>

            <Link to="/ai" className={`w-full py-4 flex items-center justify-center transition-colors ${getMenuClass("/ai")}`}>
            <div className="h-full w-[60%] flex items-center">
                <img src={pesanIcon} alt="logo" className="w-[1.5rem] text-white" />
                <p className="ml-[1.5rem] text-white text-sm font-medium">Tanya Nathan</p>
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
                {/* Gunakan Icon dari Lucide atau SVG custom */}
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

export function Header() {
const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth(); 
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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

    useEffect(() => {
        // Cek jika user_id tidak ada, hentikan fungsi
        if (!auth?.user_id) return; 

        const fetchUser = async () => {
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

        if (token) fetchUser();
        
    // PERBAIKAN DI SINI:
    // Gunakan [auth?.user_id] agar hanya jalan jika ID berubah, bukan object auth-nya.
    }, [auth?.user_id, token]);

return (
        <>
            <div className="fixed top-0 left-[18%] w-[82%] h-[10%] bg-white z-20 flex items-center justify-between px-8 shadow-sm">
                {/* Title */}
                <div className="font-gabarito font-bold text-[2rem] text-gray-800">
                    <h1>{currentTitle}</h1>
                </div>

                {/* Profile Button */}
                <div className="h-full flex items-center">
                    <button 
                        onClick={() => setIsProfileOpen(true)} // <--- Ganti navigate menjadi state true
                        className="w-[3.5rem] h-[3.5rem] cursor-pointer rounded-full overflow-hidden border-2 border-gray-100 hover:border-blue-500 transition shadow-sm"
                    >
                        <img 
                            src={userData?.photo_url || "https://via.placeholder.com/150"} 
                            alt="User" 
                            className="w-full h-full object-cover" 
                        />
                    </button>
                </div>
            </div>

            {/* Render Modal di sini (di luar div Header utama agar rapi) */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </>
    );
}