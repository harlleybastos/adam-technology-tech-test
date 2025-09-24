import jwt from 'jsonwebtoken';

export interface JwtUser {
  id: string;
  role: 'painter' | 'customer';
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

export function signToken(user: JwtUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, JWT_SECRET) as JwtUser;
}


