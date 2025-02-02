"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import FramedButton from "@/components/elements/FramedButton";
import { cn } from "@/lib/utils";
import { components } from "@/lib/item";

// The client-side component
const NavbarClient = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGettingStartedOpen, setIsGettingStartedOpen] = useState(false);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button (visible on small screens) */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          <Image
            src="/assets/menu-icon.png"
            height={24}
            width={24}
            alt="Menu"
          />
        </button>
      </div>

      {/* Mobile Menu (toggleable) */}
      {isMobileMenuOpen && (
        <div className="absolute h-screen top-16 right-0 w-full bg-[#0A0A0A] backdrop-blur-xl p-4 md:hidden z-40">
          <ul className="flex flex-col items-center gap-7">
            <li>
              <button
                onClick={() => setIsGettingStartedOpen(!isGettingStartedOpen)}
                className="text-white text-[1.3rem] w-full text-left"
              >
                Getting Started
              </button>
              {isGettingStartedOpen && (
                <ul className="flex flex-col mt-4 items-start gap-4">
                  <li>
                    <Link href="/" className="text-gray-400 rounded-lg hover:bg-[#262626] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Introduction
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/installation" className="text-gray-400 rounded-lg hover:bg-[#262626] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Installation
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/primitives/typography" className="text-gray-400 rounded-lg hover:bg-[#262626] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Typography
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setIsComponentsOpen(!isComponentsOpen)}
                className="text-white text-[1.3rem] w-full text-left"
              >
                Components
              </button>
              {isComponentsOpen && (
                <ul className="flex flex-col items-start gap-4 mt-4">
                  {components.map((component) => (
                    <li key={component.title}>
                      <Link href={component.href} className="text-gray-400 rounded-lg hover:bg-[#262626] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        {component.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link href="/docs" className="text-white text-[1.3rem]" onClick={() => setIsMobileMenuOpen(false)}>
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white text-[1.3rem]" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default NavbarClient;