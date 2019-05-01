function getTodayDate() {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = twoDigit(todayDate.getMonth() + 1);
  const day = twoDigit(todayDate.getDate());
  return `${year}-${month}-${day}T00:00:00`;
}
