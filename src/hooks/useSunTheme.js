import { useState, useEffect } from 'react';
import { getThemeByHour, getThemeBySunData } from '../utils/themeCalc';

const SEOUL = { lat: 37.5665, lng: 126.9780 };

export function useSunTheme() {
  const [sunData, setSunData] = useState(null);
  const [theme, setTheme] = useState(getThemeByHour(new Date().getHours()));

  useEffect(() => {
    const fetchSun = async (loc) => {
      try {
        const res = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${loc.lat}&lng=${loc.lng}&formatted=0`
        );
        const data = await res.json();
        if (data.status === 'OK') setSunData(data.results);
      } catch {
        // fallback to hour-based theme
      }
    };

    const init = () => {
      if (!navigator.geolocation) { fetchSun(SEOUL); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchSun({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => fetchSun(SEOUL),
      );
    };

    init();

    // Re-fetch after midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msToMidnight = midnight - now;
    const tid = setTimeout(init, msToMidnight);
    return () => clearTimeout(tid);
  }, []);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      if (sunData) {
        setTheme(getThemeBySunData(new Date(sunData.sunrise), new Date(sunData.sunset), now));
      } else {
        setTheme(getThemeByHour(now.getHours()));
      }
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, [sunData]);

  return theme;
}
