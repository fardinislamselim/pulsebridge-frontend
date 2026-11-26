"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the 90-day medical cooldown safeguard donors?",
    answer:
      "Following a whole blood donation, the human body requires approximately 8–12 weeks to fully replenish iron stores and erythrocyte volume. PulseBridge locks donor profiles atomically for 90 days following verified hospital donation to prevent over-donation, fatigue, and donor anemia.",
  },
  {
    question: "Why does PulseBridge enforce hospital verification for blood appeals?",
    answer:
      "To safeguard public donors from fraud, commercial intermediaries, and black-market plasma trades, our system records admitting hospital, physician/ward coordinates, and requires administrator or coordinator sign-off before urgent appeals are dispatched to local donors.",
  },
  {
    question: "Who can safely donate blood according to WHO and Bangladesh guidelines?",
    answer:
      "Individuals aged 18 to 60 years, weighing at least 50 kg, with a hemoglobin level of 12.5 g/dL or higher, normal blood pressure (100–140 mmHg systolic / 60–90 mmHg diastolic), and who have not had a major surgery, tattoo, or infectious fever in the preceding 6 months.",
  },
  {
    question: "What is the difference between universal red cell and universal plasma donors?",
    answer:
      "Type O-Negative (O-) is the universal red blood cell donor because its erythrocytes lack A, B, and Rh antigens, allowing safe emergency transfusion into any ABO/Rh recipient. Conversely, AB-Positive (AB+) is the universal plasma donor as its plasma lacks anti-A or anti-B antibodies.",
  },
  {
    question: "Is there any cost associated with requesting or donating blood on PulseBridge?",
    answer:
      "No. PulseBridge is a 100% voluntary, non-profit emergency humanitarian platform. Donating and requesting blood is entirely free of charge. Optional voluntary contributions directly sustain our 24/7 cloud servers, SMS dispatch gateways, and medical verification infrastructure.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/90 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-red-600 dark:text-red-400" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                <div className="pt-3">{item.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
