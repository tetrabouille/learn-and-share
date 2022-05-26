import { toDate } from 'date-fns';

const dateFromTimestamp = (value: string) => {
  const timestamp = Number(value);
  if (!value || isNaN(timestamp)) return null;
  return toDate(timestamp).toISOString().split('T')[0];
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (date.toString() === 'Invalid Date') return '';

  return date.toDateString();
};

export { dateFromTimestamp, formatDate };
