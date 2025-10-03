"use client";

import React, { useState } from "react";
import { Search, Bell, Grid3X3, User } from "lucide-react";
import Image from "next/image";
import logo from "@/asset/logo.png";
import Link from "next/link";

interface NavbarProps {
  activePage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage = "Home" }) => {
  const [searchValue, setSearchValue] = useState("");

  const navigationItems = [
    "Home",
    "Workbench",
    "Tickets",
    "Service Catalogue",
    "Knowledge Management",
    "Admin Settings",
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src={logo} alt="logo" width={86} height={22} />
          </Link>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for anything"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <a
                key={item}
                href="#"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activePage === item
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="h-6 w-[2px] bg-[#EBEBEB]" />
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>

            <button className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200">
              <Grid3X3 className="h-5 w-5" />
            </button>

            <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item}
              href="#"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePage === item
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
