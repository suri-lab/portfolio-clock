export const THEMES = {
  dawn: {
    name: 'Dawn',
    nameKr: '새벽',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    textColor: '#B0BEC5',
    accentColor: '#7C83FD',
    dimColor: 'rgba(176, 190, 197, 0.6)',
  },
  sunrise: {
    name: 'Sunrise',
    nameKr: '일출',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7C59F 50%, #EFEFD0 100%)',
    textColor: '#3E2723',
    accentColor: '#FF6B35',
    dimColor: 'rgba(62, 39, 35, 0.6)',
  },
  daytime: {
    name: 'Daytime',
    nameKr: '낮',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 50%, #dfe6e9 100%)',
    textColor: '#1A237E',
    accentColor: '#6C5CE7',
    dimColor: 'rgba(26, 35, 126, 0.6)',
  },
  sunset: {
    name: 'Sunset',
    nameKr: '일몰',
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #e17055 50%, #fdcb6e 100%)',
    textColor: '#1A237E',
    accentColor: '#e17055',
    dimColor: 'rgba(26, 35, 126, 0.6)',
  },
  night: {
    name: 'Night',
    nameKr: '밤',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    textColor: '#E0E0E0',
    accentColor: '#00b894',
    dimColor: 'rgba(224, 224, 224, 0.5)',
  },
};

export function getThemeByHour(hour) {
  if (hour >= 4 && hour < 6) return THEMES.dawn;
  if (hour >= 6 && hour < 9) return THEMES.sunrise;
  if (hour >= 9 && hour < 18) return THEMES.daytime;
  if (hour >= 18 && hour < 20) return THEMES.sunset;
  return THEMES.night;
}

export function getThemeBySunData(sunriseDate, sunsetDate, now) {
  const sr = sunriseDate.getHours() + sunriseDate.getMinutes() / 60;
  const ss = sunsetDate.getHours() + sunsetDate.getMinutes() / 60;
  const cur = now.getHours() + now.getMinutes() / 60;

  if (cur >= sr - 2 && cur < sr) return THEMES.dawn;
  if (cur >= sr && cur < sr + 3) return THEMES.sunrise;
  if (cur >= sr + 3 && cur < ss) return THEMES.daytime;
  if (cur >= ss && cur < ss + 2) return THEMES.sunset;
  return THEMES.night;
}
