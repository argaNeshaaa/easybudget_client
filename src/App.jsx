// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Hero from "./pages/Hero/Hero";
import IndexAuth from "./pages/Auth/IndexAuth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Wallet from "./pages/Wallet/Wallet";
import Transaction from "./pages/Transactions/Transaction";
import Budget from "./pages/Budgets/Budget";
import Goal from "./pages/Goal/Goal";
import Report from "./pages/Reports/Report";
import Profile from "./pages/Profile/Profile";
import AskAI from "./pages/ai/AskAI";
import { PageTransition } from "./components/ui/PageTransition";
import OverlayBackground from "./components/ui/OverlayBackground";
import { useRef, useMemo } from "react";
import GoogleAuthSuccess from "./routes/AuthSuccess";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ui/ProtectedRoute";

function App() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const showOverlay = ["/", "/login"].includes(location.pathname);
  // urutan halaman untuk menentukan maju/mundur
  const order = {
    "/": 0,
    "/login": 1,
  };

  // forward === true ketika currentOrder > prevOrder (misal "/" -> "/login")
  const forward = useMemo(() => {
    const prevOrder = order[prevPath.current] ?? 0;
    const currentOrder = order[location.pathname] ?? 0;
    const isForward = currentOrder > prevOrder;
    // update prevPath sekarang (sebelum render berikutnya)
    prevPath.current = location.pathname;
    return isForward;
  }, [location.pathname]);

  return (
    <div className="overflow-hidden w-screen h-screen relative">
      <Toaster position="top-center" reverseOrder={false} />
      {/* background / particle tetap di belakang */}
      {showOverlay}

      {/* wrapper untuk konten yang akan di-slide */}
      <div className="absolute inset-0 z-20">
        <AnimatePresence mode="sync" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition forward={forward}>
                  <Hero />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition forward={forward}>
                  <IndexAuth />
                </PageTransition>
              }
            />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
            <Route path="/goal" element={<ProtectedRoute><Goal /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />

            <Route path="/ai" element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
            <Route
              path="/auth/google/success"
              element={<ProtectedRoute><GoogleAuthSuccess /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>
                  
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
