import dayjs from "dayjs";

export const getCalendarDateFromMs = (ms) => {
  return dayjs(ms).$d;
};

export const getCalendarDateFromDateNow = () => {
  return dayjs().$d;
};
