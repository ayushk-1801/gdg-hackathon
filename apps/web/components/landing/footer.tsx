import React from "react";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer className="border-t pt-10 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 shadow-[0px_-8px_15px_rgba(0,0,0,0.1)] dark:shadow-[0px_-8px_15px_rgba(0,0,0,0.35)] rounded-t-[60px]">
      <div className="w-full px-2 sm:px-4 overflow-hidden">
        <div className="flex justify-center items-center flex-col">
          <div className="w-full text-center pb-8">
            <span
              className={`text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-bold text-zinc-900 dark:text-white tracking-wider ${spaceMono.className} leading-none`}
            >
              Benkyoshi
            </span>
          </div>
          <div className="flex items-center gap-2 pb-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-10">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>All systems operational</span>
          </div>
        </div>

        <div className=" pb-4 sm:pb-6 text-center text-xs sm:text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Benkyoshi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
