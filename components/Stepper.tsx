"use client";

interface StepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { number: 1, label: "Firmenprofil" },
  { number: 2, label: "Förderungen" },
  { number: 3, label: "Antrag" },
  { number: 4, label: "Fertig" },
];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="bg-white border-b border-[#e5e7eb]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center" aria-label="Fortschritt">
          {STEPS.map((step, idx) => {
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step item */}
                <div
                  className={`flex items-center gap-2 py-3 px-1 relative ${
                    isActive
                      ? "border-b-2 border-[#1D9E75]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  {/* Circle / Check */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-[#1D9E75] text-white"
                        : isActive
                        ? "bg-[#E1F5EE] text-[#1D9E75] border-2 border-[#1D9E75]"
                        : "bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm hidden sm:block font-medium ${
                      isActive
                        ? "text-[#1D9E75]"
                        : isCompleted
                        ? "text-[#1D9E75]"
                        : "text-[#9ca3af]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-px mx-2 flex-1 w-6 sm:w-10 transition-colors ${
                      step.number < currentStep
                        ? "bg-[#1D9E75]"
                        : "bg-[#e5e7eb]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
