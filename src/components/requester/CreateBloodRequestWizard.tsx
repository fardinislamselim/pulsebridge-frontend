"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Droplet,
  Building2,
  MapPin,
  Calendar,
  Phone,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  FileText,
  ShieldAlert,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { ApiResponse, BloodGroup, RequestUrgency, BloodRequest } from "@/types";

const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
  "Jessore",
  "Dinajpur",
  "Tangail",
  "Faridpur",
  "Pabna",
  "Kushtia",
  "Sirajganj",
  "Noakhali",
  "Brahmanbaria",
  "Feni",
  "Jamalpur",
];

const BLOOD_GROUPS: { label: string; value: BloodGroup; hint: string }[] = [
  { label: "A+", value: "A_POSITIVE", hint: "Can receive: A+, A-, O+, O-" },
  { label: "A-", value: "A_NEGATIVE", hint: "Can receive: A-, O-" },
  { label: "B+", value: "B_POSITIVE", hint: "Can receive: B+, B-, O+, O-" },
  { label: "B-", value: "B_NEGATIVE", hint: "Can receive: B-, O-" },
  { label: "AB+", value: "AB_POSITIVE", hint: "Universal Recipient (All Groups)" },
  { label: "AB-", value: "AB_NEGATIVE", hint: "Can receive: AB-, A-, B-, O-" },
  { label: "O+", value: "O_POSITIVE", hint: "Can receive: O+, O-" },
  { label: "O-", value: "O_NEGATIVE", hint: "Universal Donor (Only O- can receive)" },
];

const wizardSchema = z.object({
  // Step 1: Patient & Blood
  patientName: z
    .string()
    .trim()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name cannot exceed 100 characters"),
  bloodGroup: z.string().min(1, "Please select a valid blood group"),
  unitsRequired: z
    .number({ invalid_type_error: "Units must be a number" })
    .int("Units must be an integer")
    .min(1, "Minimum 1 unit required")
    .max(10, "Maximum 10 units allowed per single request"),

  // Step 2: Hospital & Location
  hospitalName: z
    .string()
    .trim()
    .min(2, "Hospital name must be at least 2 characters")
    .max(150, "Hospital name cannot exceed 150 characters"),
  hospitalAddress: z
    .string()
    .trim()
    .min(3, "Hospital address must be at least 3 characters")
    .max(255, "Hospital address cannot exceed 255 characters"),
  district: z.string().trim().min(2, "Please select a district"),
  city: z
    .string()
    .trim()
    .min(2, "City / Area must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),
  area: z.string().trim().optional(),

  // Step 3: Urgency, Schedule & Contact
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"] as const),
  requiredAt: z
    .string()
    .min(1, "Please specify the required date and time")
    .refine((val) => {
      const parsed = Date.parse(val);
      return !isNaN(parsed) && parsed > Date.now();
    }, { message: "Required date/time must be in the future" }),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  contactPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Please provide a valid phone number (e.g. +8801700000000)"),
  details: z.string().trim().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export function CreateBloodRequestWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Default time: 24 hours from now in local ISO string for datetime-local
  const getDefaultDatetime = () => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "",
      unitsRequired: 1,
      hospitalName: "",
      hospitalAddress: "",
      district: "",
      city: "",
      area: "",
      urgency: "URGENT",
      requiredAt: getDefaultDatetime(),
      contactPerson: "",
      contactPhone: "",
      details: "",
    },
  });

  const selectedBloodGroup = watch("bloodGroup");
  const selectedUnits = watch("unitsRequired");
  const selectedUrgency = watch("urgency");

  // Step Navigation Validation
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(["patientName", "bloodGroup", "unitsRequired"]);
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await trigger([
        "hospitalName",
        "hospitalAddress",
        "district",
        "city",
      ]);
      if (valid) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  // Mutation: POST /blood-requests
  const createRequestMutation = useMutation({
    mutationFn: async (formData: WizardFormData) => {
      const isoDatetime = new Date(formData.requiredAt).toISOString();

      const payload = {
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        unitsRequired: formData.unitsRequired,
        unitsNeeded: formData.unitsRequired,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        district: formData.district,
        city: formData.city,
        area: formData.area || undefined,
        urgency: formData.urgency,
        requiredAt: isoDatetime,
        neededAt: isoDatetime,
        contactPerson: formData.contactPerson,
        contactName: formData.contactPerson,
        contactPhone: formData.contactPhone,
        reason: formData.details || undefined,
        details: formData.details || undefined,
        additionalNotes: formData.details || undefined,
      };

      const response = await apiClient.post<ApiResponse<BloodRequest>>(
        "/blood-requests",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Blood Request Created!", {
        description: `Request for ${data.data?.patientName || "patient"} has been submitted. Automated donor matching is in progress.`,
      });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
      router.push("/requester");
    },
    onError: (err: unknown) => {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create blood request. Please check all fields.";
      toast.error("Creation Failed", { description: apiMessage });
    },
  });

  const onSubmit = (formData: WizardFormData) => {
    createRequestMutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      {/* Visual Stepper Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl transition ${
              currentStep === 1
                ? "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200"
                : currentStep > 1
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                currentStep === 1
                  ? "bg-red-600 text-white shadow-sm"
                  : currentStep > 1
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              {currentStep > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Patient & Blood</div>
              <div className="text-[10px] text-slate-500">Group & units needed</div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl transition ${
              currentStep === 2
                ? "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200"
                : currentStep > 2
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                currentStep === 2
                  ? "bg-red-600 text-white shadow-sm"
                  : currentStep > 2
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              {currentStep > 2 ? <CheckCircle2 className="h-4 w-4" /> : "2"}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Hospital & Location</div>
              <div className="text-[10px] text-slate-500">District & facility</div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl transition ${
              currentStep === 3
                ? "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200"
                : "text-slate-400"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                currentStep === 3
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              3
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Urgency & Contact</div>
              <div className="text-[10px] text-slate-500">Schedule & verification</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ================= STEP 1: Patient & Blood Requirement ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Step 1: Patient & Blood Requirement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Specify the recipient identity and exact required ABO/Rh group.
                </p>
              </div>

              {/* Patient Name */}
              <div>
                <label
                  htmlFor="patientName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Patient Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="patientName"
                    type="text"
                    placeholder="e.g. Mohammad Rahim"
                    {...register("patientName")}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.patientName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  />
                </div>
                {errors.patientName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.patientName.message}
                  </p>
                )}
              </div>

              {/* Blood Group Selectable Cards */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Required Blood Group <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = selectedBloodGroup === bg.value;
                    return (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setValue("bloodGroup", bg.value, { shouldValidate: true })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                          isSelected
                            ? "border-red-600 bg-red-50 text-red-900 shadow-sm shadow-red-600/20 dark:bg-red-950/50 dark:text-red-200 dark:border-red-600 ring-2 ring-red-600/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        }`}
                      >
                        <BloodGroupBadge bloodGroup={bg.value} size="md" variant={isSelected ? "solid" : "subtle"} />
                        <span className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {bg.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.bloodGroup && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              {/* Units Required Stepper */}
              <div>
                <label
                  htmlFor="unitsRequired"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Units Needed (Bags) <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "unitsRequired",
                          Math.max(1, (selectedUnits || 1) - 1),
                          { shouldValidate: true }
                        )
                      }
                      className="px-3.5 py-2 text-base font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedUnits || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "unitsRequired",
                          Math.min(10, (selectedUnits || 1) + 1),
                          { shouldValidate: true }
                        )
                      }
                      className="px-3.5 py-2 text-base font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setValue("unitsRequired", n, { shouldValidate: true })}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                          selectedUnits === n
                            ? "border-red-600 bg-red-600 text-white shadow-sm shadow-red-600/30"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {n} Bag{n > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.unitsRequired && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.unitsRequired.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: Hospital & Location ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Step 2: Hospital & Location Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Locating the medical facility helps alert nearby voluntary donors.
                </p>
              </div>

              {/* Hospital Name */}
              <div>
                <label
                  htmlFor="hospitalName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Hospital Name <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    id="hospitalName"
                    type="text"
                    placeholder="e.g. Dhaka Medical College Hospital, Square Hospital"
                    {...register("hospitalName")}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.hospitalName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  />
                </div>
                {errors.hospitalName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.hospitalName.message}
                  </p>
                )}
              </div>

              {/* Hospital Address */}
              <div>
                <label
                  htmlFor="hospitalAddress"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Hospital Full Address / Ward <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="hospitalAddress"
                    type="text"
                    placeholder="e.g. Cabin 502, New Building, 100 Bir Uttam CR Dutta Rd"
                    {...register("hospitalAddress")}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.hospitalAddress
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  />
                </div>
                {errors.hospitalAddress && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.hospitalAddress.message}
                  </p>
                )}
              </div>

              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    District <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="district"
                    {...register("district")}
                    className={`mt-1.5 w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.district
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  >
                    <option value="">Select district</option>
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    City / Thana <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. Dhanmondi, Shahbagh"
                    {...register("city")}
                    className={`mt-1.5 w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.city
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Urgency, Schedule & Contact ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Step 3: Urgency, Schedule & Contact
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Set emergency prioritization and provide verified direct phone contact.
                </p>
              </div>

              {/* Urgency Selection Cards */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Emergency Level <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* NORMAL */}
                  <button
                    type="button"
                    onClick={() => setValue("urgency", "NORMAL")}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition ${
                      selectedUrgency === "NORMAL"
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-600 ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Normal
                    </div>
                    <span className="mt-1 text-[11px] text-slate-500 leading-tight">
                      Elective surgery, scheduled within 24-48 hours.
                    </span>
                  </button>

                  {/* URGENT */}
                  <button
                    type="button"
                    onClick={() => setValue("urgency", "URGENT")}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition ${
                      selectedUrgency === "URGENT"
                        ? "border-amber-600 bg-amber-50/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-600 ring-2 ring-amber-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Urgent
                    </div>
                    <span className="mt-1 text-[11px] text-slate-500 leading-tight">
                      Needed within 12 hours. Priority notification.
                    </span>
                  </button>

                  {/* EMERGENCY */}
                  <button
                    type="button"
                    onClick={() => setValue("urgency", "EMERGENCY")}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition ${
                      selectedUrgency === "EMERGENCY"
                        ? "border-red-600 bg-red-50 text-red-950 dark:bg-red-950/60 dark:text-red-200 dark:border-red-600 ring-2 ring-red-600/30"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-sm text-red-600">
                      <AlertOctagon className="h-4 w-4 animate-pulse" />
                      Emergency
                    </div>
                    <span className="mt-1 text-[11px] text-slate-500 leading-tight">
                      ICU, hemorrhage, trauma. Instant push dispatch.
                    </span>
                  </button>
                </div>
              </div>

              {/* Emergency Banner Callout */}
              {selectedUrgency === "EMERGENCY" && (
                <div className="rounded-xl border border-red-200 bg-red-600 p-3.5 text-white flex items-center gap-3 shadow-md shadow-red-600/20">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <div className="text-xs">
                    <strong>Critical Emergency Mode Activated:</strong> Matching donors within a 15km radius of the hospital will receive instant push notifications and phone dispatch alerts.
                  </div>
                </div>
              )}

              {/* Required Datetime */}
              <div>
                <label
                  htmlFor="requiredAt"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Needed By Date & Time <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    id="requiredAt"
                    type="datetime-local"
                    {...register("requiredAt")}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                      errors.requiredAt
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                    }`}
                  />
                </div>
                {errors.requiredAt && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.requiredAt.message}
                  </p>
                )}
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Contact Person Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="contactPerson"
                      type="text"
                      placeholder="e.g. Alice Rahman (Attendant)"
                      {...register("contactPerson")}
                      className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                        errors.contactPerson
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                      }`}
                    />
                  </div>
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.contactPerson.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Contact Phone Number <span className="text-red-600">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="contactPhone"
                      type="tel"
                      placeholder="+8801700000000"
                      {...register("contactPhone")}
                      className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white transition ${
                        errors.contactPhone
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-red-600 focus:ring-red-600/20 dark:border-slate-700"
                      }`}
                    />
                  </div>
                  {errors.contactPhone && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Medical Reason & Details */}
              <div>
                <label
                  htmlFor="details"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Medical Notes & Reason (Optional)
                </label>
                <div className="relative mt-1.5">
                  <textarea
                    id="details"
                    rows={3}
                    placeholder="e.g., Thalassemia transfusion, road accident surgery, or hemoglobin levels."
                    {...register("details")}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                {errors.details && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.details.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous Step
              </button>
            ) : (
              <Link
                href="/requester"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </Link>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
              >
                Continue to Step {currentStep + 1}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 transition"
              >
                {createRequestMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    Submit Blood Request
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
