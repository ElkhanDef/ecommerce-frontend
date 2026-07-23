interface BrandMarkProps {
  /** Sizing/shape utilities, e.g. "w-9 h-9 rounded-xl". */
  className?: string;
  /** "gold" sits on light backgrounds (header/footer); "glass" sits on the gold gradient panels. */
  variant?: "gold" | "glass";
}

// Stylized tulip — the signature motif of Kütahya/İznik tile art — used as
// the site's mark wherever the old placeholder emoji used to sit.
export default function BrandMark({
  className = "w-9 h-9 rounded-xl",
  variant = "gold",
}: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center shrink-0 ${
        variant === "gold"
          ? "bg-gradient-to-br from-gold-dark to-gold-light shadow-sm"
          : "bg-white/20"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] text-white">
        <path
          d="M12 13 L12 19"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M12 16.5 C9.8 16.3 8.5 17.5 8 19"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M12 16.5 C14.2 16.3 15.5 17.5 16 19"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M12 13 C9.3 13 7.3 11.3 7.6 8.6 C7.7 7.6 8.2 6.8 8.9 6.3 C9 8 10.1 10.3 12 11.7 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M12 13 C14.7 13 16.7 11.3 16.4 8.6 C16.3 7.6 15.8 6.8 15.1 6.3 C15 8 13.9 10.3 12 11.7 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M12 4.5 C10.9 4.5 10.1 6 10.3 8.2 C10.4 9.6 11.1 10.6 12 11.2 C12.9 10.6 13.6 9.6 13.7 8.2 C13.9 6 13.1 4.5 12 4.5 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
