"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer/page";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Login } from "@/components/Login_Form/page";

const horizon = localFont({
  src: "../public/fonts/Horizon/gc-horizon-1.otf",
});

export default function Home() {
  const searchParams = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const loginRequired = searchParams.get("loginRequired");
    if (loginRequired === "true") {
      setShowLogin(true);
    }
  }, [searchParams]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Image
        src="/CONFIDEX.png"
        alt="confidex bg"
        fill
        className="fixed inset-0 z-0 object-cover"
      />

      <div className="z-10 w-full h-full fixed inset-0 overflow-hidden flex flex-col items-center justify-center fade-in">
        <h1
          className={`text-[4.5em] font-bold w-[70%] h-1/2 align-middle text-center mb-[8%] ml-5 mr-5
              text-[#EE964B] drop-shadow-[-1px_5px_2px_rgba(32,30,29,0.7)]  ${horizon.className}
              dark:text-[#F4D35E] dark:drop-shadow-[-1px_5px_1px_rgba(91,75,43,1)]`}
        >
          VENDING-BASED SELF-SERVICE BOOTH FOR ANONYMOUS BLOOD-BASED HEALTH
          SCREENING
        </h1>

        <Footer />
      </div>

      {/* Login Dialog */}
      {showLogin && (
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <Login onSwitchToRegister={() => {}} onSwitchToAdmin={() => {}} />
        </Dialog>
      )}
    </div>
  );
}
