import { useWeather } from '../hooks/useWeather';
import { getWeatherDesc } from '../utils/weatherDesc';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ?? '';

function WeatherIcon({ code, size = 48 }) {
  if (!code) return <span style={{ fontSize: size }}>🌡️</span>;
  return (
    <img
      src={`https://openweathermap.org/img/wn/${code}@2x.png`}
      alt="날씨 아이콘"
      width={size}
      height={size}
    />
  );
}

export default function WeatherWidget({ theme }) {
  const { weather, error, loading } = useWeather(API_KEY);

  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <h2
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: theme.dimColor }}
      >
        현재 날씨
      </h2>

      {!API_KEY && (
        <div className="flex flex-col items-center justify-center flex-1 gap-1 py-2">
          <span className="text-3xl">🔑</span>
          <p className="text-xs text-center" style={{ color: theme.dimColor }}>
            .env 파일에<br />
            <code className="text-xs px-1 rounded" style={{ background: 'rgba(255,255,255,0.15)', color: theme.textColor }}>
              VITE_WEATHER_API_KEY
            </code>
            <br />를 설정하세요
          </p>
        </div>
      )}

      {API_KEY && loading && !weather && (
        <div className="flex items-center justify-center flex-1 py-4">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: theme.accentColor, borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {API_KEY && error && !weather && (
        <div className="text-center py-2">
          <span className="text-2xl">⚠️</span>
          <p className="text-xs mt-1" style={{ color: theme.dimColor }}>
            날씨 로드 실패
          </p>
        </div>
      )}

      {weather && (
        <div className="flex items-center gap-3">
          <WeatherIcon code={weather.weather?.[0]?.icon} size={56} />
          <div className="flex-1">
            <div
              className="text-3xl font-bold"
              style={{ color: theme.textColor }}
            >
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="text-xs" style={{ color: theme.dimColor }}>
              체감 {Math.round(weather.main.feels_like)}°C
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.dimColor }}>
              {getWeatherDesc(weather.weather?.[0]?.id)}
            </div>
          </div>
        </div>
      )}

      {weather && (
        <div
          className="text-xs pt-1 border-t flex justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: theme.dimColor }}
        >
          <span>📍 {weather.name}</span>
          <span>
            💧 {weather.main.humidity}% · 💨 {Math.round(weather.wind?.speed ?? 0)}m/s
          </span>
        </div>
      )}

    </div>
  );
}
