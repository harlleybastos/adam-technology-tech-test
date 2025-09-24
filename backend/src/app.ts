import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

import { corsOptions } from "./middleware/cors.middleware.js";
import { attachUserIfPresent } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import painterRoutes from "./routes/painter.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(attachUserIfPresent);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/painter", painterRoutes);
app.use("/customer", customerRoutes);
app.use("/availability", availabilityRoutes);
app.use("/", bookingRoutes);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
});

export default app;
