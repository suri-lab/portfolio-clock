import { getTimeInZone, getDateInZone, getAmPmInZone } from '../utils/timeFormat';

const CITIES = [
  { name: '서울',   emoji: '🇰🇷', tz: 'Asia/Seoul' },
  { name: 'New York', emoji: '🇺🇸', tz: 'America/New_York' },
  { name: 'London', emoji: '🇬🇧', tz: 'Europe/London' },
  { name: '도쿄',   emoji: '🇯🇵', tz: 'Asia/Tokyo' },
];

function CityCard({ city, time, theme }) {
  const { display } = getTimeInZone(time, city.tz);
  const date = getDateInZone(time, city.tz);
  const ampm = getAmPmInZone(time, city.tz);

  return (
    <div
      className="glass-card-sm p-3 flex flex-col gap-1 text-center"
    >
      <div className="text-xl">{city.emoji}</div>
      <div className="text-xs font-semibold" style={{ color: theme.dimColor }}>
        {city.name}
      </div>
      <div
        className="text-lg font-mono font-bold tracking-wider"
        style={{ color: theme.textColor }}
      >
        {display}
        <span className="text-xs ml-1 font-normal" style={{ color: theme.accentColor }}>
          {ampm}
        </span>
      </div>
      <div className="text-xs" style={{ color: theme.dimColor }}>
        {date}
      </div>
    </div>
  );
}

export default function WorldClocks({ time, theme }) {
  return (
    <div className="glass-card p-4">
      <h2
        className="text-xs font-semibold mb-3 tracking-widest uppercase"
        style={{ color: theme.dimColor }}
      >
        세계 시간대
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {CITIES.map((city) => (
          <CityCard key={city.tz} city={city} time={time} theme={theme} />
        ))}
      </div>
    </div>
  );
}
