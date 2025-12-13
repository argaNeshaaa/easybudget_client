import { useEffect, useState } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import WeeklyChart from "./GrafikMingguan";
import DashboardCards from "./DashboardCards";
import MonthlyChart from "./MonthlyChart";
import OverviewTransactions from "./OverviewTransactions";
import api from "../../api/axios"; // Pastikan path axios benar
import useAuth from "../../hooks/useAuth"; // Optional: Jika butuh user ID, tapi biasanya token cukup
import "../../assets/styles/global.css";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State untuk Form Profile
  const [formData, setFormData] = useState({
    pekerjaan: "",
    id_penghasilan: "",
    pendapatan_bulanan: "",
  });

  // 1. Cek Profile saat Component Mount
  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("token");

      // Jika tidak ada token, paksa logout/login ulang
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // TAMBAHKAN HEADERS DI SINI
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !response.data.data) {
          setShowModal(true);
        }
      } catch (error) {
        // Jika 404 (Belum ada profile) -> Munculkan Modal
        if (error.response && error.response.status === 404) {
          setShowModal(true);
        }
        // Jika 401 (Token Expired/Invalid) -> Logout
        else if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Gagal mengecek profile:", error);
        }
      }
    };

    checkProfile();
  }, [navigate]);

  // 2. Handle Submit Form
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token"); // Ambil token lagi

    if (
      !formData.pekerjaan ||
      !formData.id_penghasilan ||
      !formData.pendapatan_bulanan
    ) {
      Swal.fire({
        icon: "warning",
        title: "Mohon Lengkapi Semua Data",
        text: false,
        showConfirmButton: false, // Hilangkan tombol
        timer: 2000, // Hilang otomatis setelah 2 detik
      }).then(() => {
        setLoading(false);
      });

      return;
    }

    try {
      // TAMBAHKAN HEADERS DI SINI JUGA
      await api.post(
        "/profile",
        {
          pekerjaan: formData.pekerjaan,
          id_penghasilan: formData.id_penghasilan,
          pendapatan_bulanan: formData.pendapatan_bulanan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profil Berhasil Dibuat",
        text: false,
        showConfirmButton: false, // Hilangkan tombol
        timer: 2000, // Hilang otomatis setelah 2 detik
      }).then(() => {
        // Navigasi dilakukan SETELAH timer selesai
        setShowModal(false);
        window.location.reload();
      });
    } catch (error) {
      console.error("Gagal membuat profile:", error);
            Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Terjadi kesalahan.",
        text: false,
        showConfirmButton: false, // Hilangkan tombol
        timer: 2000, // Hilang otomatis setelah 2 detik
      }).then(() => {
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-100 font-gabarito flex">
      <Sidebar />
      <Header />

      <div className="fixed top-[4rem] lg:top-[10%] left-0 lg:left-[18%] w-full lg:w-[82%] h-[90%] bg-[#E5E9F1] overflow-y-auto p-4 z-10">
        <div className="h-max text-white flex items-center justify-start flex-col">
          {/* BAGIAN ATAS - DASHBOARD CARDS */}
          <div className="w-full h-max flex flex-between items-center justify-between mt-[1rem] mb-[1rem]">
            <DashboardCards />
          </div>

          <div className="w-full h-max flex flex-wrap 2xl:flex-nowrap flex-between items-center justify-between mt-[1rem] mb-[1rem] gap-6">
            <div className="dashboard-card w-full 2xl:w-[50%] h-[30rem] bg-[#ffffff] lg:ml-[1rem] lg:mr-[1rem] 2xl:mr-[0] p-6 rounded-xl flex flex-col items-center justify-center text-gray-500 ">
              <WeeklyChart />
            </div>

            <div className="dashboard-card w-full 2xl:w-[50%] h-[30rem] bg-[#ffffff] lg:mr-[1rem] lg:ml-[1rem] 2xl:ml-0 p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-gray-500">
              <MonthlyChart />
            </div>
          </div>

          {/* BAGIAN BAWAH - OVERVIEW */}
          <div className="w-full h-max flex flex-between items-center justify-center mt-[1rem] mb-[1rem]">
            <div className="dashboard-card w-full h-[30rem] bg-[#ffffff] lg:ml-[1rem] lg:mr-[1rem] p-6 rounded-xl shadow-md">
              <OverviewTransactions />
            </div>
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL (Overlay) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-gray-800 w-[90%] max-w-lg p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-2 text-[#15213F]">Halo! 👋</h2>
            <p className="text-gray-500 mb-6">
              Sebelum memulai, ayo lengkapi profil keuanganmu agar kami bisa
              memberikan analisis yang lebih baik.
            </p>

            <form onSubmit={handleSubmitProfile} className="space-y-4">
              {/* Input Pekerjaan */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Pekerjaan Saat Ini
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Software Engineer, Guru, Mahasiswa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pekerjaan}
                  onChange={(e) =>
                    setFormData({ ...formData, pekerjaan: e.target.value })
                  }
                  required
                />
              </div>

              {/* Input Jenis Penghasilan */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Sumber Penghasilan Utama
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.id_penghasilan}
                  onChange={(e) =>
                    setFormData({ ...formData, id_penghasilan: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    -- Pilih Jenis Penghasilan --
                  </option>
                  <option value="1">Gaji Tetap (Bulanan)</option>
                  <option value="2">Bisnis / Usaha Sendiri</option>
                  <option value="3">Freelance / Pekerja Lepas</option>
                  <option value="4">Investasi / Pasif Income</option>
                </select>
              </div>

              {/* Input Pendapatan Bulanan */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Rata-rata Pendapatan Bulanan (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 5000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pendapatan_bulanan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pendapatan_bulanan: e.target.value,
                    })
                  }
                  required
                  min="0"
                />
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#15213F] text-white font-bold py-3 rounded-xl hover:bg-[#1e2d50] transition-colors flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Menyimpan...
                  </>
                ) : (
                  "Simpan & Lanjutkan 🚀"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
