import Link from "next/link";
import { Heart, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to PulseBridge
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your donor or requester portal
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-700"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-xs font-semibold uppercase text-slate-500">
            Quick One-Click Demo Access
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Requester
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Donor
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-red-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
