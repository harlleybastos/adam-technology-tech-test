# Frontend Integration Guide

## 🔗 API Integration Status

The React frontend has been updated to connect with your local Node.js backend. Here's what's implemented:

### ✅ API Service Layer
- **File**: `src/services/api.ts`
- **Authentication**: JWT token management with localStorage
- **Endpoints**: All assignment API endpoints implemented
- **Error Handling**: Comprehensive error handling and user feedback

### ✅ Updated Components

#### Painter Components
- **AddAvailabilityForm**: Now calls `availabilityAPI.create()`
- **AvailabilityList**: Fetches data from `availabilityAPI.getMy()`
- **PainterBookings**: Ready for `painterAPI.getBookings()`

#### Customer Components
- **BookingRequestForm**: Uses `bookingAPI.request()`
- **CustomerBookings**: Ready for `bookingAPI.getMyBookings()`

### 🔧 Configuration Required

#### 1. Backend URL Configuration
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:3001/api"; // Your backend URL
```

#### 2. CORS Setup
Your Express backend needs CORS configuration:
```typescript
app.use(cors({
  origin: "http://localhost:8080", // Lovable frontend URL
  credentials: true
}));
```

### 🚀 Testing the Integration

#### 1. Start Your Backend
```bash
cd backend/
npm run dev  # Should run on localhost:3001
```

#### 2. Test API Endpoints
The frontend will automatically connect to your backend. Test these flows:

1. **Painter Registration/Login** (when you implement auth)
2. **Add Availability** - Should POST to `/api/availability`
3. **View Availability** - Should GET from `/api/availability/me`
4. **Customer Booking Request** - Should POST to `/api/booking-request`
5. **View Bookings** - Should GET from `/api/bookings/me`

### 🔄 Mock Data Fallback

If your backend isn't ready yet, the components will show helpful error messages. You can also temporarily use the mock data by updating the components to use `mockData` from the API service.

### 📝 Expected API Responses

#### Availability Creation Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "painterId": "uuid", 
    "startTime": "2025-05-18T10:00:00Z",
    "endTime": "2025-05-18T14:00:00Z",
    "isBooked": false
  }
}
```

#### Booking Request Response (Success)
```json
{
  "success": true,
  "data": {
    "bookingId": "uuid",
    "painter": {
      "id": "uuid",
      "name": "John Painter",
      "rating": 4.8,
      "experience": 5,
      "specialties": ["Interior", "Exterior"]
    },
    "startTime": "2025-05-18T11:00:00Z",
    "endTime": "2025-05-18T13:00:00Z",
    "status": "confirmed"
  }
}
```

#### Booking Request Response (No Availability)
```json
{
  "success": false,
  "error": "No painters are available for the requested time slot.",
  "alternatives": [
    {
      "startTime": "2025-05-18T14:00:00Z",
      "endTime": "2025-05-18T16:00:00Z",
      "painter": { /* painter info */ }
    }
  ]
}
```

### 🔐 Authentication Flow

When you implement authentication:

1. **Registration/Login** calls will set JWT tokens
2. **Protected routes** will include `Authorization: Bearer <token>` headers
3. **Token expiration** is handled with automatic logout
4. **Role-based access** is enforced on both frontend and backend

### 🎯 Next Steps

1. **Implement your backend** using the provided architecture
2. **Test each API endpoint** with tools like Postman
3. **Start the backend server** on `localhost:3001`
4. **Test the full flow** through the React UI

The frontend is fully ready for your backend integration!