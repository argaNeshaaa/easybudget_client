import "../../assets/styles/global.css";
import PasswordInput from "../../components/ui/PasswordInput";
import ForgotPasswordPages from "./forgotPasswordPages";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../assets/styles/global.css";
import Swal from "sweetalert2";

const backendUrl = import.meta.env.VITE_API_URL;
function LoginPage({ onSwitch }) {
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };
  const navigate = useNavigate();

  const [showForgot, setShowForgot] = useState(false); // State toggle
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // Jika server mengirim token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali!",
        showConfirmButton: false, // Hilangkan tombol
        timer: 2000, // Hilang otomatis setelah 2 detik
      }).then(() => {
        // Navigasi dilakukan SETELAH timer selesai
        navigate("/dashboard");
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Login gagal, periksa data Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return <ForgotPasswordPages onBack={() => setShowForgot(false)} />;
  }
  return (
    <form
      onSubmit={handleLogin}
      className="login-box font-gabarito w-[28rem] h-[45rem] bg-[#ffffff] rounded-[3rem] mr-[3rem] flex flex-col items-center animate-in fade-in duration-300"
    >
      {/* ... (Header & Input Email Password SAMA SEPERTI SEBELUMNYA) ... */}
      <h1 className="login-tittle font-gabarito font-bold text-[2rem] mt-[2.5rem]">
        Selamat Datang
      </h1>
      <p className="text-black font-gabarito pt-[1rem]">
        Masukkan Email dan Kata Sandi untuk akses akun anda.
      </p>

      {/* Email */}
      <div className="w-[88%] pt-[4rem] flex flex-col ">
        <label htmlFor="" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* Password */}
      <div className="w-[88%] pt-[0.5rem] flex flex-col ">
        <label className="block text-gray-700 font-medium mb-1">
          Kata Sandi
        </label>
        <div className="relative mb-4">
          <PasswordInput
            placeholder="Masukkan Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <p className="text-red-500 text-sm mb-3 w-[88%]">{errorMsg}</p>
      )}

      {/* --- GANTI BAGIAN LINK LUPA PASSWORD --- */}
      <div className="w-[88%] flex items-center justify-between text-sm mb-6">
        <label className="flex items-center space-x-2 text-gray-700">
          <input type="checkbox" />
          <span>Ingat Saya</span>
        </label>

        <button
          type="button"
          onClick={() => setShowForgot(true)} // Toggle ke halaman Forgot
          className="text-[#7B61FF] hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          Lupa Kata Sandi Anda?
        </button>
      </div>
      {/* --------------------------------------- */}

      {/* Login Button */}
      <div className="w-[88%]">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#7B61FF] to-[#6E4CFF] text-white cursor-pointer py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </div>

      {/* Atau Masuk Dengan */}
      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-500 text-sm">Atau Masuk Dengan</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Login */}
      <div className="w-[88%]">
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full cursor-pointer flex items-center justify-center bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>
      </div>

      {/* Daftar */}
      <p className="text-center text-sm mt-6 text-gray-700">
        Belum Punya Akun?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#7B61FF] cursor-pointer font-semibold hover:underline"
        >
          Daftar.
        </button>
      </p>
    </form>
  );
}

export default LoginPage;
