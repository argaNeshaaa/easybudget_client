// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Hero from "./pages/Hero/Hero";
import IndexAuth from "./pages/Auth/indexAuth";
import Dashboard from "./pages/Dashboard/Dashboard"
import Wallet from "./pages/Wallet/Wallet"
import Transaction from "./pages/Transactions/Transaction"
import Budget from "./pages/Budgets/Budget"
import Goal from "./pages/Goal/Goal"
import { PageTransition } from "./components/ui/PageTransition";
import OverlayBackground from "./components/ui/OverlayBackground";
import { useRef, useMemo } from "react";

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
      {/* background / particle tetap di belakang */}
      {showOverlay && <OverlayBackground />}

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
            <Route 
            path="/dashboard"
            element={
              <PageTransition forward={forward}>
                <Dashboard />
              </PageTransition>
            }
             />
            <Route 
            path="/wallet"
            element={
              <PageTransition forward={forward}>
                <Wallet />
              </PageTransition>
            }
             />
            <Route 
            path="/transaction"
            element={
              <PageTransition forward={forward}>
                <Transaction />
              </PageTransition>
            }
             />
            <Route 
            path="/budget"
            element={
              <PageTransition forward={forward}>
                <Budget />
              </PageTransition>
            }
             />
            <Route 
            path="/goal"
            element={
              <PageTransition forward={forward}>
                <Goal />
              </PageTransition>
            }
             />
            <Route 
            path="/report"
            element={
              <PageTransition forward={forward}>
                <Goal />
              </PageTransition>
            }
             />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
