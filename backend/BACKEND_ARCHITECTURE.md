# Adam Painter Booking - Backend Architecture

## 🏗️ Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Docker
- **ORM:** Prisma or TypeORM
- **Authentication:** JWT
- **Validation:** Zod
- **API Documentation:** Swagger/OpenAPI

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── painter.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── availability.controller.ts
│   │   └── booking.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── cors.middleware.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Painter.ts
│   │   ├── Customer.ts
│   │   ├── Availability.ts
│   │   └── Booking.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── painter.routes.ts
│   │   ├── customer.routes.ts
│   │   ├── availability.routes.ts
│   │   └── booking.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── painter.service.ts
│   │   ├── booking.service.ts
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── scheduler.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('painter', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Painters Table
```sql
CREATE TABLE painters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    experience INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    specialties TEXT[], -- Array of specialties
    phone VARCHAR(20),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Customers Table
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Availability Table
```sql
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    painter_id UUID NOT NULL REFERENCES painters(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    painter_id UUID NOT NULL REFERENCES painters(id) ON DELETE CASCADE,
    availability_id UUID NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```typescript
// Request Body
{
  email: string;
  password: string;
  role: 'painter' | 'customer';
  name: string;
  phone?: string;
}

// Response
{
  success: boolean;
  data: {
    user: UserResponse;
    token: string;
  }
}
```

#### POST /api/auth/login
```typescript
// Request Body
{
  email: string;
  password: string;
}

// Response
{
  success: boolean;
  data: {
    user: UserResponse;
    token: string;
  }
}
```

### Painter Availability Endpoints

#### POST /api/availability
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
}

// Response
{
  success: boolean;
  data: {
    id: string;
    painterId: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }
}
```

#### GET /api/availability/me
```typescript
// Headers: Authorization: Bearer <token>
// Response
{
  success: boolean;
  data: AvailabilitySlot[];
}
```

#### DELETE /api/availability/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response
{
  success: boolean;
  message: string;
}
```

### Customer Booking Endpoints

#### POST /api/booking-request
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  notes?: string;
}

// Success Response
{
  success: boolean;
  data: {
    bookingId: string;
    painter: {
      id: string;
      name: string;
      rating: number;
      experience: number;
      specialties: string[];
    };
    startTime: string;
    endTime: string;
    status: 'confirmed';
  }
}

// No availability Response
{
  success: false;
  error: "No painters are available for the requested time slot.";
  alternatives?: {
    startTime: string;
    endTime: string;
    painter: PainterInfo;
  }[];
}
```

#### GET /api/bookings/me
```typescript
// Headers: Authorization: Bearer <token>
// Response
{
  success: boolean;
  data: BookingWithDetails[];
}
```

### Painter Bookings Endpoints

#### GET /api/painter/bookings
```typescript
// Headers: Authorization: Bearer <token>
// Response
{
  success: boolean;
  data: PainterBooking[];
}
```

## 🧠 Smart Assignment Algorithm

### Priority Scoring System
```typescript
interface PainterScore {
  painter: Painter;
  score: number;
  factors: {
    availability: number;    // 0-1 (exact match = 1)
    rating: number;         // 0-1 (rating/5)
    experience: number;     // 0-1 (experience/10)
    workload: number;       // 0-1 (fewer bookings = higher)
    specialty: number;      // 0-1 (matching specialty bonus)
  };
}

// Final Score = (rating * 0.3) + (experience * 0.25) + (availability * 0.25) + (workload * 0.15) + (specialty * 0.05)
```

### Assignment Logic
1. **Find Available Painters** - Query painters with overlapping availability
2. **Calculate Scores** - Apply scoring algorithm to each painter
3. **Sort by Score** - Highest score gets the job
4. **Handle Conflicts** - First-come-first-served for same scores
5. **Generate Alternatives** - If no exact matches, find closest slots

## 🐳 Docker Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: painter_booking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/painter_booking
      JWT_SECRET: your-jwt-secret-key
      NODE_ENV: development
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## 📦 Package.json
```json
{
  "name": "painter-booking-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "@prisma/client": "^5.6.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.9.0",
    "tsx": "^4.6.0",
    "typescript": "^5.2.2",
    "prisma": "^5.6.0"
  }
}
```

## 🔧 Implementation Priority

### Phase 1: Core Setup
1. Initialize Node.js project with TypeScript
2. Set up Express server with basic middleware
3. Configure PostgreSQL with Docker
4. Set up Prisma ORM and run migrations

### Phase 2: Authentication
1. Implement user registration/login
2. JWT token generation and validation
3. Role-based access control middleware

### Phase 3: Painter Features
1. Availability CRUD operations
2. Painter profile management
3. View assigned bookings

### Phase 4: Customer Features
1. Booking request system
2. Smart painter assignment algorithm
3. View customer bookings

### Phase 5: Advanced Features
1. Alternative slot recommendations
2. Real-time notifications
3. Rating and review system

## 🚀 Quick Start Commands

```bash
# 1. Clone and setup
git clone <your-repo>
cd painter-booking-backend
npm install

# 2. Start database
docker-compose up postgres -d

# 3. Setup database
npm run db:migrate
npm run db:seed

# 4. Start development server
npm run dev

# 5. Or start with Docker
docker-compose up
```

## 📋 Environment Variables

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/painter_booking"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:8080"
```

## 🔒 Security Features

- **Password Hashing** with bcrypt
- **JWT Authentication** with expiration
- **Input Validation** with Zod schemas  
- **CORS Configuration** for frontend
- **Helmet** for security headers
- **Rate Limiting** for API endpoints
- **SQL Injection Protection** via Prisma

This architecture provides a production-ready foundation that matches your frontend perfectly!