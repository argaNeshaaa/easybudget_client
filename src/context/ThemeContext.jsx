import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Helper: Ambil Token
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Helper: Decode JWT
  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload).user_id; 
    } catch (e) {
      return null;
    }
  };

  // 1. Fetch Theme dari Database (PERBAIKAN DISINI)
  useEffect(() => {
    const fetchSettings = async () => {
      const userId = getUserIdFromToken();
      const token = getToken(); // <--- Ambil token

      // Jika tidak ada user atau token, stop (jangan panggil API)
      if (!userId || !token) return;

      try {
        // Tambahkan Headers Authorization
        const res = await api.get(`/settings/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` } // <--- TAMBAHAN PENTING
        });

        const dbTheme = res.data.data?.theme || "light";
        setTheme(dbTheme);
      } catch (error) {
        // Jika 401/404, biarkan default 'light' dan jangan spam error berlebih
        console.error("Gagal mengambil setting user:", error.message);
      }
    };

    fetchSettings();
  }, []);

  // 2. Manipulasi DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 3. Fungsi Toggle (Update DB)
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    const userId = getUserIdFromToken();
    const token = getToken();

    if (!userId || !token) return;

    try {
      await api.patch(
        `/settings/users/${userId}`, 
        { theme: newTheme },
        { 
            headers: { Authorization: `Bearer ${token}` } // <--- Ini sudah benar dari langkah sebelumnya
        }
      );
    } catch (error) {
      console.error("Gagal menyimpan tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);