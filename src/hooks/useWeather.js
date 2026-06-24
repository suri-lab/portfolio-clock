import { useState, useEffect, useRef } from 'react';

const SEOUL = { lat: 37.5665, lon: 126.9780 };
const REFRESH_MS = 10 * 60 * 1000;

export function useWeather(apiKey) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const cachedRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) { setLocation(SEOUL); setLocationDenied(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => { setLocation(SEOUL); setLocationDenied(true); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    if (!location || !apiKey) return;

    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        cachedRef.current = data;
        setWeather(data);
        setError(null);
      } catch (e) {
        setError(e.message);
        if (cachedRef.current) setWeather(cachedRef.current);
      } finally {
        setLoading(false);
      }
    };

    fetch_();
    const id = setInterval(fetch_, REFRESH_MS);
    return () => clearInterval(id);
  }, [location, apiKey]);

  return { weather, error, loading, location, locationDenied };
}
