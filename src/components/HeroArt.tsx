/** Friendly robot-with-brain illustration (original SVG art). */
export function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="h-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0e7ff" />
        </linearGradient>
      </defs>
      {/* orbiting nodes */}
      <g stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" fill="none">
        <ellipse cx="150" cy="150" rx="135" ry="60" transform="rotate(-20 150 150)" />
        <ellipse cx="150" cy="150" rx="135" ry="60" transform="rotate(25 150 150)" />
      </g>
      {[
        [30, 120],
        [270, 95],
        [60, 225],
        [255, 210],
        [150, 25],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={8} fill={['#fde68a', '#a5f3fc', '#fbcfe8', '#bbf7d0', '#ddd6fe'][i]} />
      ))}
      {/* antenna */}
      <line x1="150" y1="55" x2="150" y2="80" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="150" cy="50" r="10" fill="#fde68a" />
      {/* head */}
      <rect x="85" y="78" width="130" height="105" rx="34" fill="url(#h-body)" />
      <rect x="102" y="102" width="96" height="52" rx="22" fill="#1e1b4b" />
      <circle cx="128" cy="128" r="10" fill="#67e8f9" />
      <circle cx="172" cy="128" r="10" fill="#67e8f9" />
      <circle cx="131" cy="125" r="3" fill="#fff" />
      <circle cx="175" cy="125" r="3" fill="#fff" />
      <path d="M135 166 Q150 176 165 166" stroke="#7c3aed" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="105" y="190" width="90" height="70" rx="22" fill="url(#h-body)" />
      <g stroke="#7c3aed" strokeWidth="3">
        <line x1="130" y1="212" x2="150" y2="225" />
        <line x1="170" y1="212" x2="150" y2="225" />
        <line x1="150" y1="225" x2="130" y2="242" />
        <line x1="150" y1="225" x2="170" y2="242" />
      </g>
      {[
        [130, 212],
        [170, 212],
        [150, 225],
        [130, 242],
        [170, 242],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={i === 2 ? '#06b6d4' : '#7c3aed'} />
      ))}
      {/* arms */}
      <path d="M105 210 Q70 200 66 170" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M195 210 Q232 222 240 250" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" />
      <text x="52" y="160" fontSize="28">📚</text>
    </svg>
  );
}
