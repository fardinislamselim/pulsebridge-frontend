"use client";

import React from "react";
import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { User, Droplet, Plus, Minus } from "lucide-react";
import type { BloodGroup } from "@/types";

const BLOOD_GROUPS: { label: string; value: BloodGroup; hint: string }[] = [
  { label: "A+", value: "A_POSITIVE", hint: "Can receive: A+, A-, O+, O-" },
  { label: "A-", value: "A_NEGATIVE", hint: "Can receive: A-, O-" },
  { label: "B+", value: "B_POSITIVE", hint: "Can receive: B+, B-, O+, O-" },
  { label: "B-", value: "B_NEGATIVE", hint: "Can receive: B-, O-" },
  { label: "AB+", value: "AB_POSITIVE", hint: "Universal Recipient (All groups)" },
  { label: "AB-", value: "AB_NEGATIVE", hint: "Can receive: AB-, A-, B-, O-" },
  { label: "O+", value: "O_POSITIVE", hint: "Can receive: O+, O-" },
  { label: "O-", value: "O_NEGATIVE", hint: "Universal Donor (Can receive: O-)" },
];

interface WizardStep1PatientProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  selectedBloodGroup: string;
  unitsRequired: number;
  errors: FieldErrors<any>;
}

export function WizardStep1Patient({
  register,
  setValue,
  selectedBloodGroup,
  unitsRequired,
  errors,
}: WizardStep1PatientProps) {
  return (
    <div className="space-y-6 text-xs">
      {/* Patient Name */}
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Patient Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., Fatima Begum"
            {...register("patientName")}
            className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
 errors.patientName
 ? "border-red-500 focus:ring-red-500/20"
 : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
 }`}
          />
        </div>
        {errors.patientName && (
          <p className="mt-1 text-red-600 font-medium">{errors.patientName.message as string}</p>
        )}
      </div>

      {/* Blood Group Selection Grid */}
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
          Required Blood Group *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedBloodGroup === bg.value;
            return (
              <button
                key={bg.value}
                type="button"
                onClick={() => setValue("bloodGroup", bg.value, { shouldValidate: true })}
                className={`p-3 rounded-xl border text-left transition-all ${
 isSelected
 ? "border-red-600 bg-red-50/80 dark:bg-red-950/40"
 : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
 }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {bg.label}
                  </span>
                  <Droplet
                    className={`h-4 w-4 ${isSelected ? "text-red-600 fill-red-600" : "text-slate-300"}`}
                  />
                </div>
                <div className="mt-1 text-[10px] text-slate-400 line-clamp-1">{bg.hint}</div>
              </button>
            );
          })}
        </div>
        {errors.bloodGroup && (
          <p className="mt-1 text-red-600 font-medium">{errors.bloodGroup.message as string}</p>
        )}
      </div>

      {/* Units Required Stepper */}
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Bags / Units Needed (1 – 10) *
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("unitsRequired", Math.max(1, (unitsRequired || 1) - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-base font-extrabold text-slate-900 dark:text-white w-12 text-center">
            {unitsRequired || 1}
          </span>
          <button
            type="button"
            onClick={() => setValue("unitsRequired", Math.min(10, (unitsRequired || 1) + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
