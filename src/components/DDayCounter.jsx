import { useState, useEffect } from 'react';

const STORAGE_KEY = 'portfolio-clock-dday';

function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function calcDDay(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / 86_400_000);
  if (diff === 0) return 'D-Day';
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

export default function DDayCounter({ theme }) {
  const [events, setEvents] = useState(loadEvents);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const add = () => {
    if (!label.trim() || !date) return;
    setEvents((prev) => [...prev, { id: Date.now(), label: label.trim(), date }]);
    setLabel('');
    setDate('');
    setOpen(false);
  };

  const remove = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: theme.dimColor }}
        >
          D-Day 카운트다운
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-6 h-6 rounded-full text-sm flex items-center justify-center transition-all"
          style={{
            background: open ? theme.accentColor : theme.accentColor + '33',
            color: open ? '#fff' : theme.accentColor,
            border: `1px solid ${theme.accentColor}66`,
          }}
        >
          {open ? '×' : '+'}
        </button>
      </div>

      {/* Add form */}
      {open && (
        <div className="flex gap-2 mb-3 animate-fade-in">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="이벤트명"
            className="flex-1 text-xs px-3 py-1.5 rounded-xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: `1px solid rgba(255,255,255,0.25)`,
              color: theme.textColor,
            }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: `1px solid rgba(255,255,255,0.25)`,
              color: theme.textColor,
            }}
          />
          <button
            onClick={add}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: theme.accentColor,
              color: '#fff',
            }}
          >
            추가
          </button>
        </div>
      )}

      {/* Event list */}
      {events.length === 0 ? (
        <p className="text-xs text-center py-2" style={{ color: theme.dimColor }}>
          + 버튼으로 D-Day를 추가하세요
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {events.map((ev) => {
            const dday = calcDDay(ev.date);
            const isPast = dday.startsWith('D+');
            return (
              <div
                key={ev.id}
                className="glass-card-sm flex items-center gap-2 px-3 py-2 group"
              >
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: isPast ? theme.dimColor : theme.accentColor }}
                >
                  {dday}
                </span>
                <span className="text-xs" style={{ color: theme.textColor }}>
                  {ev.label}
                </span>
                <button
                  onClick={() => remove(ev.id)}
                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  style={{ color: theme.dimColor }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
