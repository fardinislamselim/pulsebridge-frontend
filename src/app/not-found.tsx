import { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { HomeIcon, DropletIcon, UsersIcon, GridIcon, SearchIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | PulseBridge",
  description: "The requested blood donation resource or page could not be located.",
};

const QUICK_LINKS = [
  { label: "Blood Requests Feed", href: "/blood-requests", icon: DropletIcon, desc: "Browse urgent blood cases" },
  { label: "Donor Directory", href: "/donors", icon: UsersIcon, desc: "Search voluntary donors" },
  { label: "Compatibility Matrix", href: "/compatibility", icon: GridIcon, desc: "Interactive ABO/Rh engine" },
  { label: "Platform Homepage", href: "/", icon: HomeIcon, desc: "Return to overview" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="space-y-2">
            <span className="text-6xl font-black text-red-600 tracking-tight">404</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The case record, URL path, or directory you requested doesn&apos;t exist or has been relocated.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Helpful Destinations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-red-200 hover:bg-red-50/40 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-red-900/60 transition group"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                      <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            Return to PulseBridge Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
