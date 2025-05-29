import React from "react";
import HeroImg from "../assets/Hero.png";

export const HeroSection = () => {
  return (
    <div className="heroSection w-full rounded-md relative">
      {/* header */}
      <header className="flex lg:flex-row flex-col items-center gap-12 lg:gap-0 justify-between px-8 mt-10">
        <div className="w-full lg:w-[45%] heroText">
          <p>Secure your ideas with trust and technology.</p>
          <h1 className="text-[40px] sm:text-[60px] font-semibold leading-[45px] sm:leading-[70px]">
            <span className="marked">IPGuardian</span> is here to protect your
            innovations
          </h1>
          <p className="mt-2 text-[1rem]">
            A decentralized platform to register and verify your intellectual
            property with ease.
          </p>
        </div>

        <div className="w-full lg:w-[55%]">
          <img src={HeroImg} alt="image" className="" />
        </div>
      </header>

      {/* right blur shadow */}
      <div className="w-[100px] h-[100px] bg-[#DC0155] blur-[90px] absolute bottom-[80px] right-[80px]"></div>
    </div>
  );
};
