// src/pages/MainPages.jsx
import { Outlet } from "react-router-dom";
import { Sidebar, Header } from "../../components/ui/Navbar"; // Sesuaikan path import Anda
import "../../assets/styles/global.css";

function MainPages() {
  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito flex">
      {/* Sidebar dan Header dipanggil sekali di sini */}
      <Sidebar />
      <Header />

      {/* Container utama untuk konten halaman */}
      {/* Style ini diambil dari Dashboard.jsx sebelumnya agar konsisten */}
      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-max flex items-center justify-start flex-col">
          
          <Outlet />

        </div>
      </div>
    </div>
  );
}

export default MainPages;