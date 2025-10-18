# 🌍 TravelQuest - Travel Bucket List & Expedition Planning Platform

A full-stack travel booking platform built with **Next.js**, **MySQL**, and **Tailwind CSS** featuring complex SQL JOIN queries, booking management, and analytics dashboard.

## 🚀 Features

### Core Functionality
- **📦 Package Browsing**: Explore travel packages with destinations and transport details
- **🏨 Hotel Selection**: Choose from rated hotels with complete information
- **💳 Booking System**: Complete booking flow with payment processing
- **👤 User Dashboard**: View and manage all bookings with payment status
- **📊 Admin Analytics**: Comprehensive analytics with JOIN-based insights
  - Popular destinations and packages
  - Revenue analysis per hotel
  - Booking statistics and trends
  - User engagement metrics

### Technical Highlights
- **Complex SQL JOIN Queries**: Multi-table JOINs across 9 tables
- **Aggregation Functions**: COUNT, SUM, AVG, GROUP BY for analytics
- **Generated Columns**: Auto-calculated trip duration
- **Foreign Key Relationships**: Proper relational database design
- **RESTful API**: Clean API endpoints with proper error handling
- **Responsive UI**: Beautiful, modern interface with Tailwind CSS + shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express (Next.js API Routes)
- **Database**: MySQL 8.0+
- **ORM**: mysql2 (raw SQL with connection pooling)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MySQL 8.0+ installed and running
- Git (for cloning)

## 🔧 Installation & Setup

### 1. Clone & Install Dependencies

```bash
cd travel-bucket-list
yarn install
# or
npm install
```

### 2. Database Setup

**Start MySQL** (if not running):
```bash
# macOS
brew services start mysql

# Linux
sudo service mysql start

# Windows
# Start MySQL service from Services panel
```

**Create Database & Tables**:
```bash
mysql -u root -p < init.sql
```

Or manually:
```bash
mysql -u root -p
source init.sql;
```

This will:
- Create `travel_bucket_list` database
- Create all 9 tables with proper relationships
- Insert sample data (hotels, packages, destinations, users, bookings)

### 3. Configure Environment

Update `.env.local` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_bucket_list
```

### 4. Run the Application

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Tables Overview
- **User**: User information and addresses
- **TripPackage**: Travel packages with pricing and dates
- **Hotel**: Hotel details with ratings
- **Transport**: Transportation options linked to packages
- **Booking**: User bookings with status tracking
- **Payment**: Payment records with modes and status
- **Review**: Hotel reviews with ratings
- **Destination**: Tourist destinations linked to packages
- **Admin**: Admin users with roles

### Key Relationships
```
User ──┐
       ├──> Booking <──┐
Hotel ─┘              ├──> Payment
                      │
TripPackage ──────────┘
       │
       ├──> Destination
       └──> Transport
```

## 🔌 API Endpoints

### Packages
- `GET /api/packages` - List all packages with destinations & transport (JOIN)
- `GET /api/packages/:id` - Get package details with related data

### Bookings
- `GET /api/bookings` - All bookings (admin view) with JOIN
- `GET /api/bookings/user/:userId` - User-specific bookings with full details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status

### Hotels
- `GET /api/hotels` - List all hotels

### Payments
- `POST /api/payments` - Process payment and confirm booking

### Reviews
- `GET /api/reviews/hotel/:hotelId` - Get hotel reviews with user info (JOIN)
- `POST /api/reviews` - Submit review

### Analytics
- `GET /api/admin/analytics` - Comprehensive analytics dashboard
  - Bookings per destination (JOIN + GROUP BY)
  - Most popular packages (JOIN + aggregation)
  - Revenue per hotel (multi-table JOIN + SUM)
  - Overall statistics (COUNT, AVG)

### Users
- `POST /api/users` - Create or get existing user

## 💡 Usage Guide

### For Users

1. **Browse Packages**: View all available travel packages on the home page
2. **Book a Trip**: 
   - Click "Book Now" on any package
   - Fill in your details (Step 1)
   - Select hotel and payment method (Step 2)
   - Confirm booking
3. **View Bookings**: Check "My Bookings" tab to see all your trips
4. **Track Status**: Monitor booking and payment status

### For Admins

1. **View Analytics**: Navigate to "Analytics" tab
2. **Monitor Performance**: 
   - Track popular destinations
   - Analyze revenue per hotel
   - View booking trends
3. **Insights Available**:
   - Total bookings and revenue
   - Average booking value
   - Top performing packages and hotels
   - Destination popularity rankings

## 🎯 Key SQL Features Demonstrated

### 1. Multi-Table JOINs
```sql
SELECT 
  b.BookingID, u.Name, p.Title, h.HotelName, b.Status
FROM Booking b
JOIN User u ON b.UserID = u.UserID
JOIN TripPackage p ON b.PackageID = p.PackageID
JOIN Hotel h ON b.HotelID = h.HotelID
```

### 2. Aggregation with GROUP BY
```sql
SELECT 
  d.Name, COUNT(b.BookingID) AS TotalBookings
FROM Destination d
JOIN TripPackage p ON d.PackageID = p.PackageID
JOIN Booking b ON p.PackageID = b.PackageID
GROUP BY d.DestinationID
ORDER BY TotalBookings DESC
```

### 3. Generated Columns
```sql
Duration INT GENERATED ALWAYS AS (DATEDIFF(EndDate, StartDate)) STORED
```

### 4. Complex Analytics
```sql
SELECT 
  h.HotelName,
  COUNT(b.BookingID) AS TotalBookings,
  SUM(b.TotalAmount) AS TotalRevenue,
  AVG(h.Rating) AS AverageRating
FROM Hotel h
LEFT JOIN Booking b ON h.HotelID = b.HotelID
GROUP BY h.HotelID
```

## 🏗️ Project Structure

```
/
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # All API endpoints with JOIN queries
│   ├── page.js                   # Main frontend application
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
├── lib/
│   └── db.js                     # MySQL connection pool
├── components/
│   └── ui/                       # shadcn/ui components
├── init.sql                      # Database schema & sample data
├── .env.local                    # Environment configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🧪 Sample Data

The `init.sql` includes:
- **8 Hotels** across different countries
- **8 Trip Packages** with various destinations
- **16 Destinations** linked to packages
- **16 Transport** options (Flight, Bus, Train, Cab)
- **5 Sample Users**
- **7 Sample Bookings** with different statuses
- **6 Payment Records**
- **5 Hotel Reviews**

## 🔐 Security Features

- Connection pooling for efficient database management
- Parameterized queries to prevent SQL injection
- Environment-based configuration
- Error handling with proper HTTP status codes
- Input validation on API endpoints

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds and smooth transitions
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Interactive Elements**: Modal dialogs, tabs, cards
- **Visual Feedback**: Loading states, badges, status indicators
- **Intuitive Navigation**: Clear tabs and action buttons

## 📊 Analytics Dashboard Features

The admin analytics page provides:
- **Real-time Statistics**: Total bookings, revenue, users
- **Popular Packages**: Top-performing packages by bookings and revenue
- **Destination Insights**: Most booked destinations with city info
- **Hotel Performance**: Revenue, bookings, and ratings per hotel
- **Visual Elements**: Color-coded cards, badges, and organized data

## 🚀 Performance Optimizations

- **Connection Pooling**: Reusable database connections
- **Efficient Queries**: Optimized JOIN queries with proper indexing
- **Lazy Loading**: Components load on demand
- **Caching**: Next.js automatic caching for static content

## 🔄 Future Enhancements

Potential features to add:
- [ ] Interactive map with destination markers (Leaflet/OpenStreetMap)
- [ ] Search and filter functionality
- [ ] User authentication (JWT/OAuth)
- [ ] Email notifications for bookings
- [ ] PDF ticket generation
- [ ] Multi-currency support
- [ ] Booking cancellation workflow
- [ ] Advanced analytics with charts (Chart.js/Recharts)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql --version
ps aux | grep mysql

# Test connection
mysql -u root -p -e "SELECT 1"
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! This project demonstrates:
- SQL JOIN queries in a real-world application
- Complex database relationships
- Modern React/Next.js patterns
- RESTful API design

---

**Built with ❤️ using Next.js, MySQL, and Tailwind CSS**

For questions or issues, please refer to the documentation or create an issue.
