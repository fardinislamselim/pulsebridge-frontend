import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { NavbarAuthActions } from "./NavbarAuthActions";
import { MobileNavSheet } from "./MobileNavSheet";

interface NavItem {
  href: string;
  label: string;
}

const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/blood-requests", label: "Blood Requests" },
  { href: "/donors", label: "Find Donors" },
  { href: "/compatibility", label: "Compatibility Matrix" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Public Navbar - Pure Server Component
 * Wraps logo, public links, client auth action triggers, and mobile drawer.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      {/* Top 24/7 Emergency Coordination Bar */}
      <div className="bg-red-600 px-4 py-1 text-center text-xs font-semibold text-white">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span>PulseBridge 24/7 Emergency Blood Coordination Network Active</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo */}
        <Logo size="md" />

        {/* Center: Desktop Public Links */}
        <nav className="hidden items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-red-600 dark:hover:text-red-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Action Buttons & Mobile Menu */}
        <div className="flex items-center gap-3">
          <NavbarAuthActions />
          <MobileNavSheet />
        </div>
      </div>
    </header>
  );
}
