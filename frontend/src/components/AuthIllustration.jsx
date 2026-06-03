export default function AuthIllustration({ image, title, subtitle }) {
  return (
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-fixed to-primary-container hidden lg:flex flex-col justify-center items-center p-[var(--spacing-xl)] relative overflow-hidden">
      <div className="relative z-10 text-center flex flex-col items-center">
        <img
          src={image}
          alt="Illustration"
          className="max-w-[400px] w-full object-contain mb-[var(--spacing-lg)] rounded-[var(--radius-xl)] shadow-sm"
        />
        <h1 className="font-heading text-h1 text-on-primary-container mt-[var(--spacing-lg)] max-w-[400px]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-md text-on-primary-container/80 mt-[var(--spacing-sm)]">
            {subtitle}
          </p>
        )}
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white opacity-20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary opacity-20 rounded-full blur-[100px]" />
    </div>
  );
}