import Image from "next/image";

export default function Home() {
  return (
      <div className="border border-black z-10 w-full h-full absolute flex items-center justify-center">
        <h1
          className="text-[2.5em] font-bold w-[50rem] h-1/2 align-middle text-center m-auto 
              text-[#d7c913] drop-shadow-[4px_4px_2px_rgba(32,30,29,0.7)]">
          ABOUT PAGE
        </h1>
      </div>
  );
}

