# 🌍 TravelQuest - Concise Travel Booking Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+ 

### Setup
```bash
# Install dependencies
npm install

# Setup database
mysql -u root -p < init.sql

# Configure environment
# Create .env.local with:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=travel_bucket_list

# Run application
npm run dev
```

## 📁 Project Structure

```
app/
├── auth/                    # Authentication pages
│   ├── login/page.js       # Login form
│   └── register/page.js    # Registration form
├── api/                    # API endpoints
│   ├── users/              # User auth APIs
│   ├── packages/           # Package management
│   ├── hotels/             # Hotel data
│   ├── bookings/           # Booking system
│   ├── payments/           # Payment processing
│   └── admin/              # Admin analytics
├── dashboard/page.js       # User dashboard
├── admin/dashboard/page.js # Admin dashboard
├── packages/               # Package browsing
├── booking/new/page.js     # Booking flow
├── map/page.js            # Interactive map
└── page.js                # Home page

components/
├── map/                   # Map components
└── ui/                    # Core UI components

lib/
├── db.js                  # Database connection
├── store.js               # Zustand state management
└── utils.js               # Utilities
```

## 🎯 Features

### Core Functionality
- **Authentication**: JWT-based login/register with role detection
- **Booking System**: Multi-step booking with hotel selection and payment
- **User Dashboard**: Booking management and statistics
- **Admin Analytics**: Revenue analysis and popular packages
- **Interactive Map**: Leaflet.js with destination markers

### Database Schema
- **9 Tables**: User, Admin, Destination, TripPackage, Hotel, Transport, Booking, Payment, Review
- **Complex JOINs**: Multi-table queries for comprehensive data
- **Foreign Keys**: Proper relational constraints

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - Login with role detection

### Core APIs
- `GET /api/packages` - List travel packages
- `GET /api/hotels` - List hotels
- `POST /api/bookings` - Create booking
- `POST /api/payments` - Process payment
- `GET /api/admin/analytics` - Admin dashboard data

## 🎨 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Zustand
- **Backend**: Next.js API Routes, MySQL
- **Authentication**: JWT tokens
- **Maps**: Leaflet.js
- **UI**: Custom components with shadcn/ui base

## 🔄 User Flow

1. **Landing** → Browse packages
2. **Register/Login** → Role-based redirect
3. **Dashboard** → View bookings and stats
4. **Browse** → Select packages and hotels
5. **Book** → Multi-step booking process
6. **Pay** → Payment confirmation
7. **Manage** → Track bookings

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Sample Data

The `init.sql` includes:
- 5 sample users
- 2 admin accounts
- 10 destinations across India and UAE
- Multiple hotels and transport options
- Sample bookings and payments

**Login Credentials:**
- User: `john@example.com` / `password`
- Admin: `admin@travelquest.com` / `password`

---

**A complete, concise travel booking platform with modern architecture and comprehensive functionality.**