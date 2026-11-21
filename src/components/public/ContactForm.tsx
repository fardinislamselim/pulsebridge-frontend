"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Valid phone number required (e.g. +8801700000000)"),
  category: z.enum([
    "EMERGENCY_DISPATCH",
    "HOSPITAL_INQUIRY",
    "DONOR_COORDINATION",
    "GENERAL",
  ]),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "EMERGENCY_DISPATCH",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API dispatch (e.g. to emergency dispatch desk)
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Inquiry Dispatched Successfully!", {
      description: "Our 24/7 coordination team has logged your dispatch ticket and will respond immediately.",
    });
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {isSubmitted ? (
        <div className="text-center py-8 space-y-3">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Ticket Received & Queued
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thank you for reaching out. For urgent life-threatening transfusion emergencies, please call our 24/7 hotline directly at <strong>999</strong> or <strong>+880 1800 000 000</strong>.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-2 text-xs font-semibold text-red-600 hover:underline"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Your Full Name *</label>
              <input
                type="text"
                placeholder="Dr. Tanvir Ahmed / Rahima Khan"
                {...register("name")}
                className="w-full rounded-xl border border-slate-300 p-2.5 dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
              {errors.name && <p className="mt-1 text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="font-semibold block mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="w-full rounded-xl border border-slate-300 p-2.5 dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
              {errors.email && <p className="mt-1 text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Emergency Contact Phone *</label>
              <input
                type="tel"
                placeholder="+8801700000000"
                {...register("phone")}
                className="w-full rounded-xl border border-slate-300 p-2.5 dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              />
              {errors.phone && <p className="mt-1 text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="font-semibold block mb-1">Inquiry Department *</label>
              <select
                {...register("category")}
                className="w-full rounded-xl border border-slate-300 p-2.5 dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                <option value="EMERGENCY_DISPATCH">Emergency Dispatch Desk</option>
                <option value="HOSPITAL_INQUIRY">Hospital Blood Bank Partner</option>
                <option value="DONOR_COORDINATION">Donor Volunteer Coordination</option>
                <option value="GENERAL">General Inquiries / Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Your Message / Requirement *</label>
            <textarea
              rows={4}
              placeholder="Describe your transfusion emergency or partnership query in detail..."
              {...register("message")}
              className="w-full rounded-xl border border-slate-300 p-2.5 dark:bg-slate-950 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
            {errors.message && <p className="mt-1 text-red-600">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:opacity-70 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Dispatching Message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Dispatch Ticket
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
