export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <g stroke="#fff" strokeWidth="3" fill="none" opacity="0.9">
        <path d="M20 22 L32 32 L20 42 M32 32 L44 22 M32 32 L44 42" />
      </g>
      <g fill="#fff">
        <circle cx="20" cy="22" r="5" />
        <circle cx="20" cy="42" r="5" />
        <circle cx="32" cy="32" r="6" />
        <circle cx="44" cy="22" r="5" />
        <circle cx="44" cy="42" r="5" />
      </g>
    </svg>
  );
}
