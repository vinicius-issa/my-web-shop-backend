export const BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 10;
export const JWT_KEY = process.env.JWT_KEY || 'some-key';
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || 'some-key';
export const JWT_EXP_TIME = process.env.JWT_EXP_TIME || 24 * 60 * 60;
export const JWT_REFRESH_EXP_TIME =
  process.env.JWT_REFRESH_EXP_TIME || 24 * 60 * 60 * 7;
