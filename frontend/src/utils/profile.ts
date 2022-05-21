const getAge = (strTimestamp: string) => {
  const timestamp = Number(strTimestamp);
  if (!strTimestamp || isNaN(timestamp)) return;

  const date = new Date(timestamp);
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age -= 1;

  return `${age} years old`;
};

const getGender = (str: string) => {
  if (!str) return;
  if (str.toUpperCase() === 'M') return 'Male';
  if (str.toUpperCase() === 'F') return 'Female';
};

export { getAge, getGender };
