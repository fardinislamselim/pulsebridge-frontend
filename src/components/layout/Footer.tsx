import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import {
  PhoneCall,
  Heart,
  ShieldCheck,
  Activity,
  ArrowRight,
  Lock,
} from "lucide-react";

/**
 * Public Footer - Pure Server Component
 * High-trust medical footer with emergency helplines, quick links, and compatibility guides.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {/* Top Helpline Banner */}
      <div className="border-b border-red-100 bg-red-50/70 py-6 dark:border-red-950/60 dark:bg-red-950/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                24/7 Emergency Blood Coordination Helpline
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Direct dispatch for urgent requests, accidents, and surgical emergencies
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:16263"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-700"
            >
              Call 16263 (National Health)
            </a>
            <a
              href="tel:+8809612000000"
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/50"
            >
              +880 9612-000000 (Pulse Dispatch)
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 & 2: Brand & Platform Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              PulseBridge is a real-time blood donation and emergency medical coordination platform. We bridge voluntary blood donors, patients, and healthcare facilities with verified ABO/Rh compatibility and 90-day medical cooldown enforcement.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                Verified Donor Network
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-400">
                <Activity className="h-4 w-4" />
                ABO/Rh Safe Match
              </span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-red-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-red-600 transition">
                  Blood Requests Feed
                </Link>
              </li>
              <li>
                <Link href="/donors" className="hover:text-red-600 transition">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-red-600 transition">
                  ABO/Rh Matrix
                </Link>
              </li>
              <li>
                <Link href="/requester/requests/new" className="hover:text-red-600 transition">
                  Request Blood Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Medical & Safety Rules */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Safety & Standards
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-red-600 transition">
                  About PulseBridge
                </Link>
              </li>
              <li>
                <Link href="/about#cooldown" className="hover:text-red-600 transition">
                  90-Day Medical Cooldown
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-red-600 transition">
                  Transfusion Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600 transition">
                  Helpdesk & Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard/support-us" className="hover:text-red-600 transition">
                  Support Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: ABO Fast Reference Card */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                <Heart className="h-4 w-4 text-red-600" />
                ABO Quick Guide
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                <strong>O-</strong> is the universal red cell donor. <strong>AB+</strong> is the universal recipient.
              </p>
              <Link
                href="/compatibility"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400"
              >
                Interactive Chart
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-slate-200 py-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div>
            © {currentYear} PulseBridge Foundation. All rights reserved. Medical & Emergency Coordination Platform.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" /> 256-Bit SSL
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>HIPAA-Aligned Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
