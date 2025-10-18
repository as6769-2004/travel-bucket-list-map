# 📁 Project Structure

```
travel-bucket-list/
│
├── 📄 README.md                      # Complete documentation
├── 📄 QUICKSTART.md                  # 5-minute setup guide
├── 📄 PROJECT_STRUCTURE.md           # This file
├── 📄 package.json                   # Dependencies & scripts
├── 📄 .env.local                     # MySQL credentials (UPDATE THIS!)
│
├── 📄 init.sql                       # Database schema & sample data
├── 📄 test-db-connection.js          # Database connection tester
│
├── 📂 app/                           # Next.js App Directory
│   ├── 📄 layout.js                  # Root layout with metadata
│   ├── 📄 page.js                    # Main application (3 tabs)
│   ├── 📄 globals.css                # Global styles & Tailwind
│   │
│   └── 📂 api/                       # Backend API Routes
│       └── 📂 [[...path]]/
│           └── 📄 route.js           # All API endpoints
│
├── 📂 lib/                           # Utilities
│   └── 📄 db.js                      # MySQL connection pool
│
├── 📂 components/                    # React Components
│   └── 📂 ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       ├── label.tsx
│       └── ... (20+ components)
│
├── 📂 lib/
│   └── 📄 utils.ts                   # Utility functions (cn helper)
│
├── 📄 tailwind.config.js             # Tailwind configuration
├── 📄 postcss.config.js              # PostCSS configuration
├── 📄 next.config.js                 # Next.js configuration
│
└── 📂 node_modules/                  # Dependencies (auto-generated)
```

---

## 🔑 Key Files Explained

### Core Application Files

#### `app/page.js` (Frontend - 600+ lines)
**The main application interface with 3 tabs:**
- 📦 **Packages Tab**: Browse travel packages with booking
- 📅 **My Bookings Tab**: View user's bookings and status
- 📊 **Analytics Tab**: Admin dashboard with statistics

**Features:**
- State management with React hooks
- Booking dialog with 2-step process
- Real-time data fetching
- Responsive design with Tailwind CSS

#### `app/api/[[...path]]/route.js` (Backend - 400+ lines)
**RESTful API with complex SQL JOIN queries:**

**GET Endpoints:**
- `/api/packages` - List packages with destinations & transport
- `/api/packages/:id` - Single package details
- `/api/hotels` - List all hotels
- `/api/bookings` - All bookings (admin)
- `/api/bookings/user/:userId` - User-specific bookings
- `/api/reviews/hotel/:hotelId` - Hotel reviews with user info
- `/api/admin/analytics` - Comprehensive analytics
- `/api/destinations` - All destinations with packages

**POST Endpoints:**
- `/api/users` - Create or get user
- `/api/bookings` - Create booking
- `/api/payments` - Process payment
- `/api/reviews` - Submit review

**PUT Endpoints:**
- `/api/bookings/:id` - Update booking status

#### `lib/db.js` (Database Connection)
**MySQL connection pool configuration:**
- Connection pooling for performance
- Environment-based configuration
- Reusable across all API endpoints
- Automatic connection management

---

## 🗄️ Database Files

### `init.sql` (Schema + Sample Data - 300+ lines)
**Complete database setup:**
- Creates `travel_bucket_list` database
- Defines 9 tables with relationships
- Inserts sample data (hotels, packages, users, bookings)
- Sets up foreign key constraints
- Includes 7+ bookings for demo

**Tables Created:**
1. User (5 sample users)
2. TripPackage (8 packages)
3. Hotel (8 hotels)
4. Transport (16 transport options)
5. Destination (16 destinations)
6. Booking (7 bookings)
7. Payment (6 payments)
8. Review (5 reviews)
9. Admin (3 admins)

### `test-db-connection.js` (Database Tester)
**Verifies database setup:**
- ✅ Tests MySQL connection
- ✅ Checks if database exists
- ✅ Validates all tables are created
- ✅ Counts sample data records
- 🔧 Provides troubleshooting tips

**Run:** `yarn test-db` or `node test-db-connection.js`

---

## 🎨 UI Components (`components/ui/`)

**shadcn/ui components** (pre-installed):
- `button.tsx` - Button component with variants
- `card.tsx` - Card with header, content, footer
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selects
- `tabs.tsx` - Tab navigation
- `badge.tsx` - Status badges
- `label.tsx` - Form labels
- `textarea.tsx` - Multi-line inputs
- And 15+ more...

**All components are:**
- Fully accessible
- Styled with Tailwind CSS
- Customizable via variants
- Dark mode ready

---

## 🔧 Configuration Files

### `.env.local`
**Environment variables for MySQL:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=travel_bucket_list
```

### `package.json`
**Dependencies included:**
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `mysql2` - MySQL driver
- `@radix-ui/*` - UI component primitives
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library

**Scripts:**
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test-db` - Test database connection

### `tailwind.config.js`
**Tailwind CSS configuration:**
- Custom color scheme
- shadcn/ui theme integration
- Responsive breakpoints
- Animation utilities

---

## 📊 Data Flow

```
User Interaction (Frontend)
         ↓
    app/page.js
         ↓
    fetch('/api/...')
         ↓
app/api/[[...path]]/route.js
         ↓
    lib/db.js (MySQL Pool)
         ↓
    MySQL Database
         ↓
    SQL JOIN Queries
         ↓
    JSON Response
         ↓
    UI Updates
```

---

## 🎯 File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| `app/page.js` | 600+ | Main frontend app |
| `app/api/[[...path]]/route.js` | 400+ | All API endpoints |
| `init.sql` | 300+ | Schema + sample data |
| `test-db-connection.js` | 150+ | DB connection tester |
| `lib/db.js` | 15 | MySQL connection |
| `README.md` | 400+ | Documentation |

---

## 🚀 Development Workflow

1. **Setup**: Install dependencies → Configure `.env.local` → Run `init.sql`
2. **Test**: Run `yarn test-db` to verify database
3. **Develop**: Run `yarn dev` → Edit files → Auto-reload
4. **Test Features**: Browse packages → Make bookings → Check analytics
5. **Build**: Run `yarn build` for production

---

## 📝 Notes

- **No separate backend folder**: Next.js API routes handle backend
- **No ORM**: Direct SQL queries for learning JOIN operations
- **Component library**: shadcn/ui for consistent UI
- **Type safety**: JavaScript (can be migrated to TypeScript)
- **State management**: React hooks (useState, useEffect)
- **Styling**: Tailwind CSS utility classes

---

## 🔍 Finding Things

**Want to modify...**
- **UI/Frontend**: Edit `app/page.js`
- **API endpoints**: Edit `app/api/[[...path]]/route.js`
- **Database schema**: Edit `init.sql`
- **Styling**: Edit `app/globals.css` or Tailwind classes
- **Database config**: Edit `lib/db.js` or `.env.local`
- **Package list**: Edit packages section in `app/page.js`

**Want to add...**
- **New API endpoint**: Add to `route.js` GET/POST/PUT handlers
- **New page**: Create new file in `app/` directory
- **New component**: Add to `components/` directory
- **New table**: Add SQL to `init.sql`

---

**Ready to code?** Start with `app/page.js` for frontend or `app/api/[[...path]]/route.js` for backend! 🎨
