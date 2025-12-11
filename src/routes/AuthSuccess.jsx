import { useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Tidak perlu ini dulu

function GoogleAuthSuccess() {
  // const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Token dari URL:", token); // <-- Debugging 1

    if (token) {
      // 1. Simpan token
      localStorage.setItem("token", token);
      
      // 2. Refresh halaman & Paksa masuk dashboard
      // Ini memastikan state aplikasi ter-reset dan membaca localStorage baru
      window.location.href = "/dashboard"; 
    } else {
      console.error("Token tidak ditemukan di URL"); // <-- Debugging 2
      // navigate("/login");
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
       <p>Sedang memproses login...</p>
    </div>
  );
}

export default GoogleAuthSuccess;