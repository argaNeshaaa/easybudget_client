import { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import OverlayBackground from "../../components/ui/OverlayBackground";

function IndexAuth() {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="login relative h-screen w-screen flex justify-center items-center overflow-hidden text-white ">
      <OverlayBackground />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div
          className={` absolute lg:w-[50%] w-full justify-center lg:relative h-full flex items-center lg:justify-end transition-all duration-700 ${
            activeForm === "register"
              ? "z-20 scale-100 blur-0 opacity-100 pointer-events-auto select-auto"
              : "z-10 scale-95 blur-md opacity-60 pointer-events-none select-none"
          }`}
        >
          <RegisterPage onSwitch={() => setActiveForm("login")} />
        </div>

        {/* LoginPage (depan) */}
        <div
          className={` absolute lg:w-[50%] w-full justify-center lg:relative h-full flex items-center lg:justify-start transition-all duration-700 ${
            activeForm === "login"
              ? "z-20 scale-100 blur-0 opacity-100 pointer-events-auto select-auto"
              : "z-10 scale-95 blur-md opacity-60  pointer-events-none select-none"
          }`}
        >
          <LoginPage onSwitch={() => setActiveForm("register")} />
        </div>
      </div>
    </div>
  );
}

export default IndexAuth;
