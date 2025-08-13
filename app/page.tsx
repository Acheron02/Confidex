import Image from "next/image";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer/page";


const horizon = localFont({
  src: "../public/fonts/Horizon/gc-horizon-1.otf",
});

export default function Home() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <Image
        src="/CONFIDEX.png"
        alt="confidex bg"
        layout="fill"
        style={{ objectFit: "cover" }}
        className="fixed inset-0 z-0"
      />
      <div className="z-10 w-full h-full fixed inset-0 overflow-hidden flex items-center justify-center fade-in">
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
    </div>
  );
}
