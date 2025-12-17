import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // 1. Cek Token (Sesuai logika Remember Me yang kita buat)
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // 2. Jika token TIDAK ADA, redirect ke /login
  if (!token) {
    // `state={{ from: location }}` berguna agar setelah login sukses, 
    // user bisa dikembalikan ke halaman yang tadi mau dibuka (misal: /wallet)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Jika token ADA, render halaman aslinya (children)
  return children;
};

export default ProtectedRoute;