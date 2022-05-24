const getAge = (value: string | number) => {
  if (!value) return;

  let date: Date;
  const timestamp = Number(value);
  isNaN(timestamp) ? (date = new Date(value)) : (date = new Date(timestamp));

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
