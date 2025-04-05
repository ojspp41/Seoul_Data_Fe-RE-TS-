// ../utils/dateUtils.ts

export const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

export const getWeekDays = (today: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = -2; i <= 4; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};
// ../utils/dateUtils.ts

export const isDateInRange = (date: Date, range: string): boolean => {
    const [startStr, endStr] = range.split('~').map(str => str.trim());
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    return date >= start && date <= end;
  };
  