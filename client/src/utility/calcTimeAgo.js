import { format, formatDistance } from "date-fns";

const calcTimeAgo = (createdAt, noSuffix) => {
  if (Number.isInteger(createdAt))
    return formatDistance(createdAt, Date.now(), {
      addSuffix: true,
      includeSeconds: true,
    });
  return formatDistance(Date.parse(createdAt), Date.now(), {
    addSuffix: !noSuffix,
    includeSeconds: true,
  });
  // return timeAgo;
};

export const calcMonthAndYear = (createdAt) => {
  return format(Date.parse(createdAt), "MMMM y");
};

export default calcTimeAgo;
