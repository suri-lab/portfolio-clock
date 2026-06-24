import { useSunTheme } from './hooks/useSunTheme';
import { useClock } from './hooks/useClock';
import ClockFace from './components/ClockFace';
import WorldClocks from './components/WorldClocks';
import WeatherWidget from './components/WeatherWidget';
import EyeGuard from './components/EyeGuard';
import DDayCounter from './components/DDayCounter';

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
      className="flex flex-col items-center justify-start py-8 px-4"
    >
      <div className="w-full max-w-xl space-y-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h1
            className="text-lg font-semibold tracking-[0.3em] uppercase"
            style={{ color: theme.dimColor }}
          >
            Portfolio Desktop Clock
          </h1>
        </div>

        {/* Main Clock */}
        <ClockFace time={time} theme={theme} />

        {/* World Clocks */}
        <WorldClocks time={time} theme={theme} />

        {/* Weather + Eye Guard row */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherWidget theme={theme} />
          <EyeGuard theme={theme} />
        </div>

        {/* D-Day */}
        <DDayCounter theme={theme} />

        {/* Footer */}
        <p className="text-center text-xs pb-4" style={{ color: theme.dimColor }}>
          황수리 포트폴리오 · React + Vite + Tailwind CSS
        </p>
      </div>
    </div>
  );
}
