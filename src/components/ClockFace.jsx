import { padTwo } from '../utils/timeFormat';

const HOUR_MARKS = Array.from({ length: 12 }, (_, i) => i);
const MINUTE_MARKS = Array.from({ length: 60 }, (_, i) => i);

export default function ClockFace({ time, theme }) {
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  const secondDeg = s * 6;
  const minuteDeg = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const digital = `${padTwo(h)}:${padTwo(m)}:${padTwo(s)}`;
  const dateStr = time.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <div className="glass-card p-6 flex flex-col items-center gap-4">
      {/* Analog Clock */}
      <div className="relative" style={{ width: 220, height: 220 }}>
        <svg viewBox="0 0 200 200" width={220} height={220}>
          {/* Outer glow ring */}
          <circle cx="100" cy="100" r="96"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          {/* Clock face */}
          <circle cx="100" cy="100" r="90"
            fill="rgba(255,255,255,0.07)"
          />

          {/* Minute tick marks */}
          {MINUTE_MARKS.map((i) => {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const isHour = i % 5 === 0;
            const r1 = isHour ? 78 : 83;
            const r2 = 88;
            return (
              <line key={i}
                x1={100 + r1 * Math.cos(angle)}
                y1={100 + r1 * Math.sin(angle)}
                x2={100 + r2 * Math.cos(angle)}
                y2={100 + r2 * Math.sin(angle)}
                stroke={theme.textColor}
                strokeWidth={isHour ? 2 : 0.8}
                strokeOpacity={isHour ? 0.8 : 0.4}
              />
            );
          })}

          {/* Hour numbers */}
          {[12, 3, 6, 9].map((n) => {
            const angle = ((n === 12 ? 0 : n * 30) - 90) * (Math.PI / 180);
            return (
              <text key={n}
                x={100 + 68 * Math.cos(angle)}
                y={100 + 68 * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.textColor}
                fontSize="10"
                fontWeight="600"
                fontFamily="'Segoe UI', sans-serif"
              >
                {n}
              </text>
            );
          })}

          {/* Hour hand */}
          <line
            x1="100" y1="100"
            x2="100" y2="58"
            stroke={theme.textColor}
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${hourDeg}, 100, 100)`}
            style={{ transition: 'transform 0.5s ease' }}
          />

          {/* Minute hand */}
          <line
            x1="100" y1="100"
            x2="100" y2="38"
            stroke={theme.textColor}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${minuteDeg}, 100, 100)`}
            style={{ transition: 'transform 0.5s ease' }}
          />

          {/* Second hand */}
          <line
            x1="100" y1="112"
            x2="100" y2="28"
            stroke={theme.accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${secondDeg}, 100, 100)`}
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="5"
            fill={theme.accentColor}
          />
          <circle cx="100" cy="100" r="2.5"
            fill={theme.textColor}
          />
        </svg>
      </div>

      {/* Digital time */}
      <div className="text-center">
        <div
          className="text-5xl font-mono font-bold tracking-widest"
          style={{ color: theme.textColor, letterSpacing: '0.1em' }}
        >
          {digital}
        </div>
        <div
          className="mt-1 text-sm font-medium"
          style={{ color: theme.dimColor }}
        >
          {dateStr}
        </div>
        <div
          className="mt-1 text-xs px-3 py-0.5 rounded-full inline-block"
          style={{
            background: theme.accentColor + '33',
            color: theme.accentColor,
            border: `1px solid ${theme.accentColor}66`,
          }}
        >
          {theme.nameKr} · {theme.name}
        </div>
      </div>
    </div>
  );
}
