export const formatTime = (inputTime: any): string => {
  if (!inputTime) return '';

  const time = new Date(inputTime);
  const formattedTime = time.toLocaleDateString();
  const timeArr = formattedTime.split('/');
  timeArr.forEach((t, i) => {
    if (t.length === 1) {
      timeArr[i] = `0${t}`;
    }
  });

  return timeArr.join('/');
};

export const getNumberOfDatesInMonth = (currentYear?: number): number[] => {
  const _currentYear = currentYear ?? new Date().getFullYear();

  const monthDates: number[] = [];

  for (let i = 1; i <= 12; i++) {
    if (i <= 7) {
      if (i === 2) {
        monthDates.push(_currentYear % 4 === 0 ? 29 : 28);
      } else {
        monthDates.push(i % 2 === 0 ? 30 : 31);
      }
    } else {
      monthDates.push(i % 2 === 0 ? 31 : 30);
    }
  }

  // [Jan, Feb, Mar,....]
  return monthDates;
};

export const getDayByDates = (
  date: number,
  month: number,
  year: number
): number => {
  const _date = new Date(year, month, date);

  // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
  return _date.getDay();
};

export const onCorrectTime = (time: string): string => {
  let returnedTime = time;
  const numberOfDateInThisMonth = getNumberOfDatesInMonth(
    handleCastDateString(returnedTime).year
  );

  if (
    handleCastDateString(returnedTime).date >
    numberOfDateInThisMonth[handleCastDateString(returnedTime).month - 1]
  ) {
    const difference =
      handleCastDateString(returnedTime).date -
      numberOfDateInThisMonth[
        Number(handleCastDateString(returnedTime).month) - 1
      ];
    returnedTime = `${difference}/${
      handleCastDateString(returnedTime).month + 1
    }/${handleCastDateString(returnedTime).year}`;
  }

  if (handleCastDateString(returnedTime).date < 1) {
    let monthIdx = Number(handleCastDateString(returnedTime).month) - 2;
    monthIdx = monthIdx >= 0 ? monthIdx : 11 - 2;

    const difference =
      handleCastDateString(returnedTime).date +
      numberOfDateInThisMonth[monthIdx];
    returnedTime = `${difference}/${
      handleCastDateString(returnedTime).month - 1
    }/${handleCastDateString(returnedTime).year}`;
  }

  if (handleCastDateString(returnedTime).month > 12) {
    const difference = handleCastDateString(returnedTime).month - 12;
    returnedTime = `${handleCastDateString(returnedTime).date}/${difference}/${
      handleCastDateString(returnedTime).year + 1
    }`;
  }

  if (handleCastDateString(returnedTime).month < 1) {
    const difference = handleCastDateString(returnedTime).month + 12;
    returnedTime = `${handleCastDateString(returnedTime).date}/${difference}/${
      handleCastDateString(returnedTime).year - 1
    }`;
  }

  return returnedTime !== time ? onCorrectTime(returnedTime) : returnedTime;
};

export const handleCastDateString = (dateString: string) => {
  const [date, month, year] = dateString.split('/');

  return { date: Number(date), month: Number(month), year: Number(year) };
};

export const onGetLabelByDay = (day: number, isShort: boolean): string => {
  switch (day) {
    case 1:
      return isShort ? 'T2' : 'Thứ 2';
    case 2:
      return isShort ? 'T3' : 'Thứ 3';
    case 3:
      return isShort ? 'T4' : 'Thứ 4';
    case 4:
      return isShort ? 'T5' : 'Thứ 5';
    case 5:
      return isShort ? 'T6' : 'Thứ 6';
    case 6:
      return isShort ? 'T7' : 'Thứ 7';
    case 7:
      return isShort ? 'CN' : 'Chủ nhật';
    default:
      return '';
  }
};

export const onAddZeroToTime = (time: number): string => {
  return time < 10 ? `0${time}` : time.toString();
};

export const onGetLabelByMonth = (month: number, isShort: boolean): string => {
  switch (month) {
    case 0:
      return isShort ? 'LABEL.JAN' : 'LABEL.JANUARY';
    case 1:
      return isShort ? 'LABEL.FEB' : 'LABEL.FEBRUARY';
    case 2:
      return isShort ? 'LABEL.MAR' : 'LABEL.MARCH';
    case 3:
      return isShort ? 'LABEL.APR' : 'LABEL.APRIL';
    case 4:
      return isShort ? 'LABEL.MAY' : 'LABEL.MAY';
    case 5:
      return isShort ? 'LABEL.JUN' : 'LABEL.JUNE';
    case 6:
      return isShort ? 'LABEL.JUL' : 'LABEL.JULY';
    case 7:
      return isShort ? 'LABEL.AUG' : 'LABEL.AUGUST';
    case 8:
      return isShort ? 'LABEL.SEP' : 'LABEL.SEPTEMBER';
    case 9:
      return isShort ? 'LABEL.OCT' : 'LABEL.OCTOBER';
    case 10:
      return isShort ? 'LABEL.NOV' : 'LABEL.NOVEMBER';
    case 11:
      return isShort ? 'LABEL.DEC' : 'LABEL.DECEMBER';
    default:
      return '';
  }
};

export const convertMinutesToHour = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return minute > 0 ? `${hour}:${minute}` : hour.toString();
};

export const timeStringToSeconds = (timeString: string): number => {
  // Expect timeString in the format "HH:MM:SS.ms"
  const [hours, minutes, secondsAndMs] = timeString.split(':');
  const [seconds, ms] = secondsAndMs.split('.');
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseFloat(`0.${ms}`)
  );
}

export function formatRemainingTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}
