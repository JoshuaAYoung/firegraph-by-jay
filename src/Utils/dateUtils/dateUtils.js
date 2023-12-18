import { format, parse } from 'date-fns';

export const parseDateString = (dateString) => {
  if (dateString) {
    const [date, time] = dateString.split('T');
    const dateObj = parse(date, 'yyyy-M-d', new Date());
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
      return '';
    }
    const dateISO = format(dateObj, 'yyyy-MM-dd');
    const datePlusTime = new Date(`${dateISO}T${time}`);
    return {
      date: format(datePlusTime, 'MMM do, yyyy'),
      dateWithTime: format(datePlusTime, 'MMM do, yyyy h:mm aaaa'),
      isoDateWithTime: format(datePlusTime, 'MM/dd/yyyy h:mm aaaa'),
    };
  }
  return '';
};

export const minutesToHourString = (minutes) => {
  if (minutes) {
    const minutesNumber = Number(minutes);
    const hours = Math.floor(minutesNumber / 60);
    const minutesLeft = Math.round(minutesNumber % 60);
    return `${hours}h${minutesLeft}m`;
  }
  return '';
};
