"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit3, X, Loader2 } from "lucide-react";
import { useUpdateBloodRequest } from "@/hooks/useBloodRequests";
import { BANGLADESH_DISTRICTS } from "@/components/requester/WizardStep2Hospital";
import type { BloodRequest, BloodGroup, RequestUrgency } from "@/types";

const editSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name required").max(100),
  bloodGroup: z.string().min(1, "Blood group required"),
  unitsNeeded: z.coerce.number().int().min(1).max(10),
  hospitalName: z.string().trim().min(2, "Hospital name required").max(150),
  hospitalAddress: z.string().trim().min(3, "Hospital address required").max(255),
  district: z.string().trim().min(2, "District required"),
  city: z.string().trim().min(2, "City required"),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"] as const),
  neededAt: z.string().min(1, "Date required"),
  contactPerson: z.string().trim().min(2, "Contact person required"),
  contactPhone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Valid phone required"),
  notes: z.string().trim().max(1000).optional(),
});

type EditFormData = z.infer<typeof editSchema>;

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
];

interface EditRequestDialogProps {
  request: BloodRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRequestDialog({ request, isOpen, onClose }: EditRequestDialogProps) {
  const updateMutation = useUpdateBloodRequest(request.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (request) {
      const needed = request.neededAt
        ? new Date(request.neededAt).toISOString().slice(0, 16)
        : "";

      reset({
        patientName: request.patientName,
        bloodGroup: request.bloodGroup,
        unitsNeeded: request.unitsNeeded,
        hospitalName: request.hospitalName,
        hospitalAddress: request.hospitalAddress,
        district: request.district,
        city: request.city,
        urgency: request.urgency,
        neededAt: needed,
        contactPerson: request.contactName || request.requester?.name || "",
        contactPhone: request.contactPhone,
        notes: request.additionalNotes || request.reason || "",
      });
    }
  }, [request, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: EditFormData) => {
    const isoDate = new Date(data.neededAt).toISOString();
    await updateMutation.mutateAsync({
      patientName: data.patientName,
      bloodGroup: data.bloodGroup as BloodGroup,
      unitsNeeded: data.unitsNeeded,
      unitsRequired: data.unitsNeeded,
      hospitalName: data.hospitalName,
      hospitalAddress: data.hospitalAddress,
      district: data.district,
      city: data.city,
      urgency: data.urgency,
      neededAt: isoDate,
      requiredAt: isoDate,
      contactName: data.contactPerson,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      additionalNotes: data.notes || undefined,
      reason: data.notes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Blood Request</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-semibold block mb-1">Patient Name *</label>
              <input type="text" {...register("patientName")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Blood Group *</label>
              <select {...register("bloodGroup")} className="w-full rounded-lg border p-2 dark:bg-slate-950">
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Units Needed *</label>
              <input type="number" min={1} max={10} {...register("unitsNeeded")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Urgency *</label>
              <select {...register("urgency")} className="w-full rounded-lg border p-2 dark:bg-slate-950">
                <option value="NORMAL">Normal Priority</option>
                <option value="URGENT">Urgent Priority</option>
                <option value="EMERGENCY">Emergency Critical</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Hospital Name *</label>
              <input type="text" {...register("hospitalName")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">District *</label>
              <select {...register("district")} className="w-full rounded-lg border p-2 dark:bg-slate-950">
                {BANGLADESH_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">City *</label>
              <input type="text" {...register("city")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Required Datetime *</label>
              <input type="datetime-local" {...register("neededAt")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Contact Person *</label>
              <input type="text" {...register("contactPerson")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Contact Phone *</label>
              <input type="text" {...register("contactPhone")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Hospital Address *</label>
            <input type="text" {...register("hospitalAddress")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
          </div>

          <div>
            <label className="font-semibold block mb-1">Notes</label>
            <textarea rows={2} {...register("notes")} className="w-full rounded-lg border p-2 dark:bg-slate-950" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 font-semibold">Cancel</button>
            <button type="submit" disabled={updateMutation.isPending} className="rounded-lg bg-red-600 px-4 py-1.5 font-semibold text-white">
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
