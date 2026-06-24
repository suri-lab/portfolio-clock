import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_MS = 20 * 60 * 1000;  // 20 minutes
const REST_S  = 20;               // 20 seconds

export default function EyeGuard({ theme }) {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState('idle');    // 'idle' | 'working' | 'resting'
  const [workLeft, setWorkLeft] = useState(WORK_MS / 1000);
  const [restLeft, setRestLeft] = useState(REST_S);

  const workRef = useRef(null);
  const restRef = useRef(null);

  const startRest = useCallback(() => {
    setPhase('resting');
    setRestLeft(REST_S);

    if (Notification.permission === 'granted') {
      new Notification('눈 건강 알림 👀', {
        body: '20초간 6m 거리의 먼 곳을 바라보세요!',
        tag: 'eye-guard',
      });
    }
  }, []);

  const endRest = useCallback(() => {
    setPhase('working');
    setWorkLeft(WORK_MS / 1000);
  }, []);

  // Work countdown
  useEffect(() => {
    if (phase !== 'working') return;
    workRef.current = setInterval(() => {
      setWorkLeft((prev) => {
        if (prev <= 1) { clearInterval(workRef.current); startRest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(workRef.current);
  }, [phase, startRest]);

  // Rest countdown
  useEffect(() => {
    if (phase !== 'resting') return;
    restRef.current = setInterval(() => {
      setRestLeft((prev) => {
        if (prev <= 1) { clearInterval(restRef.current); endRest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(restRef.current);
  }, [phase, endRest]);

  const toggle = async () => {
    if (!enabled) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      setEnabled(true);
      setPhase('working');
      setWorkLeft(WORK_MS / 1000);
    } else {
      setEnabled(false);
      setPhase('idle');
      clearInterval(workRef.current);
      clearInterval(restRef.current);
    }
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}분 ${String(sec).padStart(2, '0')}초` : `${sec}초`;
  };

  const workPercent = phase === 'working'
    ? ((WORK_MS / 1000 - workLeft) / (WORK_MS / 1000)) * 100
    : phase === 'resting' ? 100 : 0;

  const restPercent = phase === 'resting'
    ? ((REST_S - restLeft) / REST_S) * 100
    : 0;

  return (
    <>
      {/* Resting overlay */}
      {phase === 'resting' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-card p-8 text-center max-w-sm mx-4">
            <div className="text-6xl mb-4">👀</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: theme.textColor }}
            >
              눈 건강 알림
            </h2>
            <p className="mb-4 text-sm" style={{ color: theme.dimColor }}>
              6m(약 20피트) 거리의<br />먼 곳을 바라보세요
            </p>

            {/* Rest timer circle */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="44"
                  fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                <circle cx="50" cy="50" r="44"
                  fill="none"
                  stroke={theme.accentColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - restPercent / 100)}`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span
                className="absolute text-2xl font-bold font-mono"
                style={{ color: theme.textColor }}
              >
                {restLeft}
              </span>
            </div>

            <button
              onClick={endRest}
              className="px-5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: theme.accentColor + '33',
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}66`,
              }}
            >
              건너뛰기
            </button>
          </div>
        </div>
      )}

      {/* Widget */}
      <div className="glass-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: theme.dimColor }}
          >
            눈 건강 알림
          </h2>
          <button
            onClick={toggle}
            className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300"
            style={{ background: enabled ? theme.accentColor : 'rgba(255,255,255,0.2)' }}
          >
            <span
              className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
              style={{ transform: enabled ? 'translateX(24px)' : 'translateX(4px)' }}
            />
          </button>
        </div>

        {!enabled ? (
          <div className="text-center py-2">
            <div className="text-3xl mb-1">👁️</div>
            <p className="text-xs" style={{ color: theme.dimColor }}>
              20-20-20 법칙<br />
              <span style={{ color: theme.textColor }}>20분 · 20초 · 20피트</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs" style={{ color: theme.dimColor }}>
              {phase === 'working' ? '집중 중' : '휴식 중'}
            </div>

            {/* Work progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1" style={{ color: theme.dimColor }}>
                <span>다음 알림까지</span>
                <span style={{ color: theme.textColor }}>{fmtTime(workLeft)}</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${workPercent}%`,
                    background: `linear-gradient(90deg, ${theme.accentColor}66, ${theme.accentColor})`,
                  }}
                />
              </div>
            </div>

            <div className="text-xs" style={{ color: theme.dimColor }}>
              20분마다 눈 쉬어가기 알림
            </div>
          </div>
        )}
      </div>
    </>
  );
}
