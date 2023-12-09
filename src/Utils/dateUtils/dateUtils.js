import { format, parse } from 'date-fns';

export const parseISODateString = (dateString) => {
  if (dateString) {
    const [date, time] = dateString.split('T');
    const dateObj = parse(date, 'yyyy-M-d', new Date());
    const dateISO = format(dateObj, 'yyyy-MM-dd');
    return new Date(`${dateISO}T${time}`);
  }
  return '--';
};

export const minutesToHourString = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  const paddedMinutesLeft = minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft;
  return `${hours}:${paddedMinutesLeft}`;
};
