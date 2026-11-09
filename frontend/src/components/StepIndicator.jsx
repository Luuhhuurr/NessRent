export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-lg)] max-w-2xl">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className={`flex-1 ${!isActive && !isCompleted ? 'opacity-50' : ''}`}>
            <div className="h-1 rounded-full bg-outline-variant overflow-hidden mb-2">
              <div
                className={`h-full rounded-full bg-primary transition-all duration-300 ${
                  isCompleted || isActive ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <p className={`text-label-md ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              <span className="text-on-surface-variant">Step {stepNumber}:</span> {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
