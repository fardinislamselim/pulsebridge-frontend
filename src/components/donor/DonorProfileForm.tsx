"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ShieldAlert, Save, Loader2 } from "lucide-react";
import { useDonorProfile, useUpdateDonorProfile } from "@/hooks/useDonor";
import { BANGLADESH_DISTRICTS } from "@/constants/districts";
import { formatBloodGroup } from "@/components/shared/BloodGroupBadge";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { updateDonorProfileSchema, BLOOD_GROUPS, type UpdateDonorProfileFormValues } from "@/schemas/donor.schema";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white";

export function DonorProfileForm() {
  const { data: profile, isLoading } = useDonorProfile();
  const updateMutation = useUpdateDonorProfile();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UpdateDonorProfileFormValues>({
    resolver: zodResolver(updateDonorProfileSchema),
    defaultValues: { bloodGroup: undefined, gender: "", district: "", city: "", address: "", dateOfBirth: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bloodGroup: profile.bloodGroup ?? undefined,
        gender: profile.gender ?? "",
        district: profile.district ?? "",
        city: profile.city ?? "",
        address: profile.address ?? "",
        dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).split("T")[0] : "",
      });
    }
  }, [profile, reset]);

  if (isLoading) return <FormSkeleton fields={6} columns={2} />;

  return (
    <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Donor Clinical Profile</h2>
          <p className="text-slate-500">Keep your clinical details accurate for emergency matching</p>
        </div>
        <div>
          {profile?.isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Donor
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold">
              Pending Admin Verification
            </span>
          )}
        </div>
      </div>

      {profile?.hasMedicalRestriction && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Active Medical Restriction</p>
            <p className="mt-0.5 opacity-90">{profile.medicalRestrictionReason || "A medical hold is active on this account."}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group *</label>
          <select {...register("bloodGroup")} className={inputClass}>
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map((g) => (<option key={g} value={g}>{formatBloodGroup(g)} ({g.replace("_", " ")})</option>))}
          </select>
          {errors.bloodGroup && <p className="mt-1 text-red-500">{errors.bloodGroup.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
          <select {...register("gender")} className={inputClass}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-red-500">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
          <input type="date" {...register("dateOfBirth")} className={inputClass} />
          {errors.dateOfBirth && <p className="mt-1 text-red-500">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">District *</label>
          <select {...register("district")} className={inputClass}>
            <option value="">Select District</option>
            {BANGLADESH_DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
          {errors.district && <p className="mt-1 text-red-500">{errors.district.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City / Upazila *</label>
          <input type="text" placeholder="e.g. Mirpur, Dhanmondi" {...register("city")} className={inputClass} />
          {errors.city && <p className="mt-1 text-red-500">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
          <input type="text" placeholder="e.g. House 12, Road 4" {...register("address")} className={inputClass} />
          {errors.address && <p className="mt-1 text-red-500">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button type="submit" disabled={updateMutation.isPending || !isDirty} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition">
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
}
