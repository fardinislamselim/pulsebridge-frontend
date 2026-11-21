"use client";

import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Building2, MapPin } from "lucide-react";

export const BANGLADESH_DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur",
  "Mymensingh", "Comilla", "Gazipur", "Narayanganj", "Bogura", "Cox's Bazar",
  "Jessore", "Dinajpur", "Tangail", "Faridpur", "Pabna", "Kushtia", "Sirajganj",
  "Noakhali", "Brahmanbaria", "Feni", "Jamalpur",
];

interface WizardStep2HospitalProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function WizardStep2Hospital({ register, errors }: WizardStep2HospitalProps) {
  return (
    <div className="space-y-5 text-xs">
      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Hospital / Clinical Facility Name *
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., Square Hospital, Panthapath"
            {...register("hospitalName")}
            className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
              errors.hospitalName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
            }`}
          />
        </div>
        {errors.hospitalName && (
          <p className="mt-1 text-red-600 font-medium">{errors.hospitalName.message as string}</p>
        )}
      </div>

      <div>
        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Full Hospital Address *
        </label>
        <input
          type="text"
          placeholder="e.g., 18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205"
          {...register("hospitalAddress")}
          className={`w-full rounded-xl border p-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
            errors.hospitalAddress
              ? "border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
          }`}
        />
        {errors.hospitalAddress && (
          <p className="mt-1 text-red-600 font-medium">{errors.hospitalAddress.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            District *
          </label>
          <select
            {...register("district")}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
          >
            <option value="">Select Hospital District</option>
            {BANGLADESH_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-red-600 font-medium">{errors.district.message as string}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            City / Upazila / Area *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g., Dhanmondi / Mirpur"
              {...register("city")}
              className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                errors.city
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
              }`}
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-red-600 font-medium">{errors.city.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
