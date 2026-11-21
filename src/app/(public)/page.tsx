import Link from "next/link";
import { Heart, Activity, ShieldCheck, ArrowRight, UserPlus, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Emergency Ticker */}
      <div className="border-b border-red-200 bg-red-600 px-4 py-2 text-center text-xs font-semibold text-white dark:border-red-900">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-white" />
          PulseBridge 24/7 Emergency Blood Coordination Network Active
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-500/20">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pulse<span className="text-red-600">Bridge</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Blood & Emergency Network
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <Link href="/blood-requests" className="hover:text-red-600 transition-colors">
              Blood Requests
            </Link>
            <Link href="/donors" className="hover:text-red-600 transition-colors">
              Find Donors
            </Link>
            <Link href="/compatibility" className="hover:text-red-600 transition-colors">
              Compatibility Matrix
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-red-600/30 transition hover:bg-red-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Join as Donor
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <Activity className="h-3.5 w-3.5 text-red-600" />
              Real-time ABO/Rh Automated Matching System
            </div>
            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Every drop counts.{" "}
              <span className="text-red-600">Every second matters.</span>
            </h1>
            <p className="mt-5 text-base text-slate-600 sm:text-lg dark:text-slate-300">
              PulseBridge connects blood recipients, voluntary donors, and hospitals
              with verified ABO/Rh compatibility, 90-day medical cooldown guards, and
              instant emergency response.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/requester/requests/new"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Request Blood Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=DONOR"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                Register as Blood Donor
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/60">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    8 Compatibility
                  </div>
                  <div className="text-xs text-slate-500">ABO & Rh Antigen Engine</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    90-Day Cooldown
                  </div>
                  <div className="text-xs text-slate-500">Medical Donor Protection</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    24/7 Verified
                  </div>
                  <div className="text-xs text-slate-500">Emergency Dispatch Queue</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <p>© {new Date().getFullYear()} PulseBridge. Healthcare & Emergency Coordination Platform.</p>
      </footer>
    </div>
  );
}
