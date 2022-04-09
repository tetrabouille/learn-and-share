import bcrypt from 'bcrypt';
import md5 from 'md5';

const getHash = (value: string) => {
  return bcrypt.hash(value, 10);
};

const verifyValue = (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};

const getSimpleHash = (value: string) => {
  return md5(value);
};

export { getHash, verifyValue, getSimpleHash };
