"use client";

import { useState } from "react";
import Image from "next/image";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";
import step5 from "../assets/step5.png";

const steps = [
  {
    title: "Go to your Dashboard",
    desc: "Access all your tools and overview from your main dashboard after logging in.",
    img: step1,
    arrow: null, // add custom SVG or overlay if needed
  },
  {
    title: "View & Use Public Code",
    desc: "Browse available public snippets and instantly use them via the command line.",
    img: step2,
    arrow: null,
  },
  {
    title: "Sign Up to Save Your Own Code",
    desc: "Click on ‘Sign Up’ to create an account and start managing your own snippets.",
    img: step3,
    arrow: null,
  },
  {
    title: "Upload or Paste Your Code",
    desc: "Choose to upload your code file directly or copy-paste it in our editor.",
    img: step4,
    arrow: null,
  },
  {
    title: "Manage & Reuse Effortlessly",
    desc: "Organize, share, and reuse your code anytime—right from your dashboard or terminal.",
    img: step5,
    arrow: null,
  },
];

export default function LandingPageWalkthrough() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-6">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full transition-all duration-200 ease-in-out ${
              idx === step ? "bg-purple-500 scale-110" : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      {/* Step Card */}
      <div className="bg-zinc-900/90 rounded-2xl shadow-2xl max-w-xl w-full p-8 flex flex-col items-center">
        <div className="relative w-full h-64 flex items-center justify-center mb-6">
          <Image
            src={steps[step].img}
            alt={`Step ${step + 1}`}
            className="w-full h-64 object-contain rounded-lg border border-zinc-800 shadow-md bg-zinc-800"
            style={{ background: "#18181b" }}
            layout="fill"
          />
          {/* Optional: animated arrow overlay can go here */}
          {steps[step].arrow}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          Step {step + 1}: {steps[step].title}
        </h2>
        <p className="mb-6 text-zinc-200 text-center text-base">
          {steps[step].desc}
        </p>
        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 transition-colors"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
            disabled={step === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
