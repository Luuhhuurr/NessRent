export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-xl)] max-w-2xl">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <div key={index} className={`flex-1 ${!isActive && !isCompleted ? 'opacity-50' : ''}`}>
            <div className="h-2 rounded-full bg-surface-variant overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-primary-container w-full' : isActive ? 'bg-primary-container w-full' : 'bg-surface-variant w-0'
                }`}
              />
            </div>
            <p className={`text-label-md ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              Step {index + 1}: {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}