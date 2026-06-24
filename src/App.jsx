import { useSunTheme } from './hooks/useSunTheme';
import { useClock } from './hooks/useClock';
import ClockFace from './components/ClockFace';
import WorldClocks from './components/WorldClocks';
import WeatherWidget from './components/WeatherWidget';
import EyeGuard from './components/EyeGuard';
import DDayCounter from './components/DDayCounter';

const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;

export default function App() {
  const theme = useSunTheme();
  const time  = useClock();

  return (
    <div
      style={{
        background: theme.gradient,
        minHeight: '100vh',
        transition: 'background 2s ease',
      }}
      className="flex flex-col items-center justify-start"
    >
      {/* Electron 전용 — 드래그 바 + 창 컨트롤 */}
      {isElectron && (
        <div
          style={{ WebkitAppRegion: 'drag', cursor: 'move' }}
          className="w-full h-8 flex items-center justify-between px-3 select-none flex-shrink-0"
        >
          <span className="text-xs" style={{ color: theme.dimColor }}>
            ⏰ Portfolio Clock
          </span>
          <div
            style={{ WebkitAppRegion: 'no-drag' }}
            className="flex items-center gap-2"
          >
            <button
              title="최소화"
              onClick={() => window.electronAPI.minimizeApp()}
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,195,0,0.7)', color: '#7a5900' }}
            >
              −
            </button>
            <button
              title="트레이로 최소화"
              onClick={() => window.electronAPI.closeApp()}
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,90,90,0.7)', color: '#7a0000' }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className={`w-full max-w-xl space-y-4 px-4 ${isElectron ? 'pb-6' : 'py-8'}`}>
        {/* Header */}
        {!isElectron && (
          <div className="text-center mb-2">
            <h1
              className="text-lg font-semibold tracking-[0.3em] uppercase"
              style={{ color: theme.dimColor }}
            >
              Portfolio Desktop Clock
            </h1>
          </div>
        )}

        {/* Main Clock */}
        <ClockFace time={time} theme={theme} />

        {/* Weather + Eye Guard row */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherWidget theme={theme} />
          <EyeGuard theme={theme} />
        </div>

        {/* D-Day */}
        <DDayCounter theme={theme} />

        {/* World Clocks */}
        <WorldClocks time={time} theme={theme} />

        {/* Footer */}
        <p className="text-center text-xs pb-2" style={{ color: theme.dimColor }}>
          황수리 포트폴리오 · React + Vite + Tailwind CSS
          {isElectron && ' + Electron'}
        </p>
      </div>
    </div>
  );
}
