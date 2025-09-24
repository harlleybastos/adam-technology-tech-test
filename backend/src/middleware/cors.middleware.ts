import { CorsOptions } from 'cors';

const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8080';
const allowList = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowList.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};


