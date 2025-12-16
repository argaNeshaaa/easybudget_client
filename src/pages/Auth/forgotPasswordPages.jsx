import { useState } from "react";
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle, Loader2 } from "lucide-react";
import api from "../../api/axios";
import PasswordInput from "../../components/ui/PasswordInput";
import toast from "react-hot-toast"; // Opsional: Untuk notifikasi lebih cantik

export default function ForgotPasswordPages({ onBack }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Helper untuk menangani error API
  const handleError = (err, defaultMsg) => {
    console.error("Error Debug:", err); // Lihat error asli di Console Browser (F12)
    const msg = err.response?.data?.message || defaultMsg;
    setError(msg);
    // toast.error(msg); // Jika pakai react-hot-toast
  };

  // STEP 1: Kirim OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Trim email untuk menghapus spasi di awal/akhir
      await api.post("/auth/forgot-password", { email: email.trim() });
      setStep(2);
    } catch (err) {
      handleError(err, "Gagal mengirim OTP. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verifikasi OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-otp", { email: email.trim(), otp: otp.trim() });
      setStep(3);
    } catch (err) {
      handleError(err, "Kode OTP salah atau kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        setError("Konfirmasi password tidak cocok.");
        return;
    }
    
    if (newPassword.length < 6) {
        setError("Password minimal 6 karakter.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { 
        email: email.trim(), 
        otp: otp.trim(), 
        newPassword 
      });
      setStep(4); // Success
    } catch (err) {
      handleError(err, "Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-gabarito w-[95%] sm:w-[28rem] min-h-[30rem] bg-white rounded-[3rem] flex flex-col items-center p-8 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Tombol Back (Hanya jika belum sukses) */}
      {step < 4 && (
          <button 
            onClick={step === 1 ? onBack : () => { setStep(step - 1); setError(""); }} 
            className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft size={24} />
          </button>
      )}

      <div className="mt-12 w-full flex flex-col items-center text-center">
        
        {/* --- STEP 1: EMAIL --- */}
        {step === 1 && (
          <>
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mb-4">
                <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lupa Password?</h2>
            <p className="text-gray-500 text-sm mb-8 px-4">
              Masukkan email yang terdaftar, kami akan mengirimkan kode OTP untuk mereset kata sandi Anda.
            </p>
            
            <form onSubmit={handleRequestOtp} className="w-full">
                <div className="text-left mb-6">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition text-gray-800"
                        placeholder="contoh@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition flex justify-center items-center gap-2 shadow-lg shadow-violet-200 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Kirim Kode OTP"}
                </button>
            </form>
          </>
        )}

        {/* --- STEP 2: INPUT OTP --- */}
        {step === 2 && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi OTP</h2>
              <p className="text-gray-500 text-sm mb-8 px-4">
                Kode OTP telah dikirim ke <b>{email}</b>. Masukkan kode 6 digit tersebut di bawah ini.
              </p>
              
              <form onSubmit={handleVerifyOtp} className="w-full">
                  <div className="text-left mb-6">
                      <input 
                          type="text" 
                          required
                          maxLength={6}
                          className="w-full mt-1 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-800"
                          placeholder="------"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                  </div>
                  {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>}
                  
                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : "Verifikasi"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-400 mt-4 cursor-pointer hover:text-blue-600 underline bg-transparent border-none"
                  >
                    Kirim ulang kode?
                  </button>
              </form>
            </>
          )}

        {/* --- STEP 3: NEW PASSWORD --- */}
        {step === 3 && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Password Baru</h2>
              <p className="text-gray-500 text-sm mb-8 px-4">
                Silakan buat kata sandi baru yang aman untuk akun Anda.
              </p>
              
              <form onSubmit={handleResetPassword} className="w-full text-left">
                  <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 ml-1">Password Baru</label>
                      <PasswordInput 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)} // Pastikan PasswordInput menghandle event onChange standard
                          placeholder="Minimal 6 karakter"
                      />
                  </div>
                  <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 ml-1">Konfirmasi Password</label>
                      <PasswordInput 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru"
                      />
                  </div>

                  {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}
                  
                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-lg shadow-green-200 disabled:opacity-70"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                  </button>
              </form>
            </>
        )}

        {/* --- STEP 4: SUCCESS --- */}
        {step === 4 && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h2>
              <p className="text-gray-500 text-sm mb-8 px-4">
                Kata sandi Anda telah berhasil diubah. Silakan login menggunakan kata sandi baru.
              </p>
              
              <button 
                  onClick={onBack} 
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg"
              >
                  Kembali ke Login
              </button>
            </>
        )}

      </div>
    </div>
  );
}