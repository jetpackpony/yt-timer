export const msInADay = 24 * 60 * 60 * 1000;
// Set the date cutoff to 5 am
export const cutOffHour = 5;
export const getCurrentDayStart = () => {
  const date = new Date();
  if (date.getHours() < 5) {
    date.setDate(date.getDate() - 1);
  }
  date.setHours(cutOffHour, 0, 0, 0);
  return date.getTime();
};
