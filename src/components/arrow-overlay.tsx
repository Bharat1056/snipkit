export function ArrowOverlay({ position = "bottom-right", className = "" }: { readonly position?: "bottom-right" | "top-left" | "top-right" | "bottom-left" | "center", readonly className?: string }) {
    const positionClasses = {
      "bottom-right": "absolute bottom-4 right-6",
      "top-left": "absolute top-4 left-6",
      "top-right": "absolute top-4 right-6",
      "bottom-left": "absolute bottom-4 left-6",
      "center": "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    };
  
    return (
      <svg
        className={`${positionClasses[position]} animate-bounce ${className}`}
        width={60}
        height={60}
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M10 40 L30 50 L50 10"
          stroke="#a78bfa"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="30" cy="50" r="4" fill="#a78bfa" />
      </svg>
    );
  }
  