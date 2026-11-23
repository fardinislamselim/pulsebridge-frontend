"use client";

import React from "react";
import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { AlertOctagon, AlertTriangle, Calendar, Phone, User, FileText } from "lucide-react";
import type { RequestUrgency } from "@/types";

interface WizardStep3UrgencyProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  selectedUrgency: RequestUrgency;
  errors: FieldErrors<any>;
}

export function WizardStep3Urgency({
  register,
  setValue,
  selectedUrgency,
  errors,
}: WizardStep3UrgencyProps) {
  const urgencyTiers: { value: RequestUrgency; label: string; desc: string }[] = [
    { value: "NORMAL", label: "Normal Priority", desc: "Routine transfusion within 48+ hours" },
    { value: "URGENT", label: "Urgent Priority", desc: "Surgery / transfusion within 24 hours" },
    { value: "EMERGENCY", label: "Critical Emergency", desc: "Immediate trauma / ICU broadcast (< 6 hours)" },
  ];

  return (
    <div className="space-y-5 text-xs">
      {/* Urgency Selector */}
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
          Urgency Level *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {urgencyTiers.map((tier) => {
            const isSelected = selectedUrgency === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => setValue("urgency", tier.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
 isSelected
 ? tier.value === "EMERGENCY"
 ? "border-red-600 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
 : "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
 : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
 }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{tier.label}</span>
                  {tier.value === "EMERGENCY" ? (
                    <AlertOctagon className="h-4 w-4 text-red-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{tier.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedUrgency === "EMERGENCY" && (
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center gap-2.5">
          <AlertOctagon className="h-4 w-4 text-red-600 shrink-0" />
          <span>Automated emergency dispatch will instantly broadcast to all compatible donors in this district.</span>
        </div>
      )}

      {/* Required Date & Time */}
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Required Before (Date & Time) *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="datetime-local"
            {...register("requiredAt")}
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
          />
        </div>
        {errors.requiredAt && (
          <p className="mt-1 text-red-600 font-medium">{errors.requiredAt.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Emergency Contact Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g., Brother / Attendant"
              {...register("contactPerson")}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
          </div>
          {errors.contactPerson && (
            <p className="mt-1 text-red-600 font-medium">{errors.contactPerson.message as string}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Emergency Contact Phone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="tel"
              placeholder="+8801700000000"
              {...register("contactPhone")}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
          </div>
          {errors.contactPhone && (
            <p className="mt-1 text-red-600 font-medium">{errors.contactPhone.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Additional Clinical Notes / Instructions
        </label>
        <textarea
          rows={3}
          placeholder="e.g., Surgery scheduled for tomorrow morning. Platelet count low."
          {...register("details")}
          className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
        />
      </div>
    </div>
  );
}
