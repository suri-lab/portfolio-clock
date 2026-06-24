export function getTimeInZone(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '00';
  return {
    hours: parseInt(get('hour'), 10),
    minutes: parseInt(get('minute'), 10),
    seconds: parseInt(get('second'), 10),
    display: `${get('hour')}:${get('minute')}`,
  };
}

export function getDateInZone(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getAmPmInZone(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: true,
    hour: 'numeric',
  });
  return fmt.format(date).endsWith('AM') ? 'AM' : 'PM';
}

export function padTwo(n) {
  return String(n).padStart(2, '0');
}
