import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ShieldAlert } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact & 24/7 Emergency Dispatch | PulseBridge",
  description:
    "Direct hotline, hospital transfusion coordination desk, and inquiry dispatch for PulseBridge Emergency Blood Platform.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/60">
          <Clock className="h-3.5 w-3.5" /> 24 Hours / 7 Days Active Dispatch
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Emergency Coordination & Support
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Have an urgent transfusion requirement or partnership inquiry? Reach our medical coordination desk immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Contacts */}
        <div className="space-y-6">
          {/* Critical Emergency Hotline Box */}
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-950 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Life-Threatening Emergency?
              </h3>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              For active surgeries, trauma cases, or severe postpartum hemorrhage, call our priority dispatch desk directly:
            </p>
            <div className="pt-2">
              <a
                href="tel:999"
                className="block text-2xl font-extrabold text-red-600 dark:text-red-400 hover:underline"
              >
                Hotline 999
              </a>
              <a
                href="tel:+8801800000000"
                className="block text-sm font-bold text-red-700 dark:text-red-300 mt-1 hover:underline"
              >
                +880 1800-PULSE (78573)
              </a>
            </div>
          </div>

          {/* Standard Contact Info Cards */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Hospital Transfusion Desk</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  +880 2 9876543
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">Mon–Sun, 24 Hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Electronic Dispatch Desk</span>
                <a
                  href="mailto:dispatch@pulsebridge.org"
                  className="font-bold text-red-600 hover:underline text-sm block"
                >
                  dispatch@pulsebridge.org
                </a>
                <span className="text-slate-500 block text-[11px] mt-0.5">Automated ticket creation</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Operations Center</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">
                  PulseBridge Emergency HQ
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Level 7, Healthcare City, Mohakhali, Dhaka-1212
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
