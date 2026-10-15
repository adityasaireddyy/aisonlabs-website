/** A simple drawn illustration of a bus route: numbered stops joined by a line. Not a product screen. */
export default function RouteDiagram({ className }: { className?: string }) {
  const stops = [
    { x: 70, y: 250 },
    { x: 190, y: 150 },
    { x: 330, y: 190 },
    { x: 450, y: 90 },
    { x: 560, y: 120 },
  ];
  const d = `M ${stops.map((s) => `${s.x} ${s.y}`).join(" L ")}`;
  return (
    <svg aria-hidden="true" viewBox="0 0 640 320" className={className} fill="none">
      <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
        {[40, 100, 160, 220, 280].map((y) => (
          <path key={y} d={`M0 ${y} H640`} />
        ))}
        {[80, 160, 240, 320, 400, 480, 560].map((x) => (
          <path key={x} d={`M${x} 0 V320`} />
        ))}
      </g>
      <path d={d} stroke="var(--accent)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1 0" />
      {stops.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r="17" fill="var(--accent)" />
          <text x={s.x} y={s.y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">
            {i + 1}
          </text>
        </g>
      ))}
      <g transform="translate(520 205)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="0" y="0" width="64" height="38" fill="none" />
        <path d="M0 18 H64 M20 0 V18 M44 0 V18" />
        <circle cx="16" cy="42" r="5" fill="currentColor" />
        <circle cx="48" cy="42" r="5" fill="currentColor" />
      </g>
    </svg>
  );
}
