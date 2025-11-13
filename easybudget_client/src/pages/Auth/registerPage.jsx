import PasswordInput from "../../components/ui/PasswordInput";
import { useState } from "react";

function RegisterPage({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
  return (
    <>
      <div className="register-box font-gabarito w-[28rem] h-[45rem] bg-[#ffffff] rounded-[3rem] mr-[3rem] flex  flex-col items-center">
        <h1 className="login-tittle font-gabarito font-bold text-[2rem] mt-[2.5rem]">
          Buat Akun
        </h1>
        <p className="text-black font-gabarito pt-[1rem]">
          Ayo Kelola Keuangan anda dengan Easy Budget.
        </p>

        <div className="w-[88%] pt-[2rem] flex flex-col ">
          <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            Nama
          </label>
          <input
            type="username"
            placeholder="Masukan Nama"
            className="w-full mb-4 px-4 py-2 text-black font-gabarito rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
          />
        </div>

        <div className="w-[88%] flex flex-col ">
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

        <div className="w-[88%] flex flex-col ">
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

        <div className="w-[88%] flex flex-col ">
          <label className="block text-gray-700 font-medium mb-1">
            Kata Sandi
          </label>
          <div className="relative mb-4">
            <PasswordInput
              placeholder="Ulangi Kata Sandi"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[88%] pt-[0.5rem]">
          <button className="w-full bg-gradient-to-r from-[#7B61FF] to-[#6E4CFF] text-white cursor-pointer py-2 rounded-xl font-semibold hover:opacity-90 transition-all">
            Register
          </button>
        </div>
        {/* Atau Masuk Dengan */}
        <div className="my-3 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">Atau Daftar Dengan</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className=" w-[88%]">
          <button className="w-full cursor-pointer flex items-center justify-center bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition">
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
          Sudah Punya Akun?{" "}
          <button
            onClick={onSwitch}
            className="text-[#7B61FF] font-semibold hover:underline"
          >
            Login.
          </button>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
