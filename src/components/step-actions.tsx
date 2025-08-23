'use client';

import { useState } from 'react';
import Image from 'next/image';
import { steps } from '../constants/landing.constant';

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
              idx === step
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      {/* Step Card */}
      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl max-w-xl w-full p-8 flex flex-col items-center">
        <div className="relative w-full h-64 flex items-center justify-center mb-6">
          <Image
            src={steps[step].img}
            alt={`Step ${step + 1}`}
            className="w-full h-64 object-contain rounded-lg border border-gray-700 shadow-md bg-gray-800"
            style={{ background: '#1f2937' }}
            layout="fill"
          />
          {/* Optional: animated arrow overlay can go here */}
          {steps[step].arrow}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Step {step + 1}: {steps[step].title}
        </h2>
        <p className="mb-6 text-gray-300 text-center text-base">
          {steps[step].desc}
        </p>
        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 transition-colors"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))}
            disabled={step === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
