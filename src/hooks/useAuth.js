import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return null;

  try {
    const user = jwtDecode(token);
    return user;
  } catch (error) {
    console.error("Token invalid:", error);
    return null;
  }
}
