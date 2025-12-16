import PasswordInput from "../../components/ui/PasswordInput";
import { useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

function RegisterPage({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accountType, setAccountType] = useState("personal"); // default
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password !== confirm) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      const res = await api.post("/users", {
        name,
        email,
        password,
        account_type: accountType,
      });

      console.log("Register success:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Registrasi berhasil! Silakan login.",
        icon: "success",
        confirmButtonText: "Lanjut Login",
        confirmButtonColor: "#7B61FF", // Sesuaikan dengan warna tema aplikasi Anda
      }).then((result) => {
        if (result.isConfirmed) {
          onSwitch(); // Pindah ke halaman login setelah user klik OK
        }
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <>
      <div className="register-box font-gabarito w-[95%] sm:w-[23rem] 2xl:w-[28rem] bg-[#ffffff] rounded-[3rem] lg:mr-[3rem] flex flex-col items-center">
        <h1 className="login-tittle font-gabarito font-bold text-[2rem] mt-[1rem] lg:mt-[0] 2xl:mt-[1rem] 2xl:mt-[2.5rem]">
          Buat Akun
        </h1>

        <p className="text-black font-gabarito 2xl:pt-[1rem]">
          Ayo Kelola Keuangan anda dengan Easy Budget.
        </p>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Nama */}
        <div className="w-[88%] pt-[1rem] 2xl:pt-[2rem] flex flex-col">
          <label className="block text-gray-700 font-medium mb-1">Nama</label>
          <input
            type="text"
            placeholder="Masukan Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 2xl:mb-4 px-4 py-3 lg:py-[0.5rem] 2xl:py-3 text-black font-gabarito rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Email */}
        <div className="w-[88%] flex flex-col">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 lg:py-[0.5rem] 2xl:py-3 border border-gray-300 rounded-lg text-gray-700 mb-2 2xl:mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Password */}
        <div className="w-[88%] flex flex-col">
          <label className="block text-gray-700 font-medium mb-1">
            Kata Sandi
          </label>
          <PasswordInput
            placeholder="Masukkan Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="w-[88%] flex flex-col mt-2 2xl:mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Ulangi Kata Sandi
          </label>
          <PasswordInput
            placeholder="Ulangi Kata Sandi"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* Account Type */}
        <div className="w-[88%] flex flex-col mt-2 2xl:mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Tipe Akun
          </label>

          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-4 py-3 lg:py-[0.5rem] 2xl:py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
          >
            <option value="personal">Personal</option>
            <option value="businesses">Businesses</option>
          </select>
        </div>

        {/* Button Register */}
        <div className="w-[88%] pt-[3rem] lg:pt-[1rem] 2xl:pt-[3rem]">
          <button
            type="submit"
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-[#7B61FF] to-[#6E4CFF] text-white cursor-pointer py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm mt-6 text-gray-700 mb-4">
          Sudah Punya Akun?{" "}
          <button
            onClick={onSwitch}
            className="text-[#7B61FF] cursor-pointer font-semibold hover:underline"
          >
            Login.
          </button>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
