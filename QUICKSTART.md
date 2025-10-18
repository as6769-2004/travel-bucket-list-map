# 🚀 Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies
```bash
yarn install
```

### 2️⃣ Start MySQL
Make sure MySQL is running on your system:

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo service mysql start
```

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find MySQL service and click Start

### 3️⃣ Create Database
Run the initialization script:
```bash
mysql -u root -p < init.sql
```

Enter your MySQL password when prompted.

### 4️⃣ Configure Environment
Update `.env.local` with your MySQL password:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=travel_bucket_list
```

### 5️⃣ Test Database Connection (Optional but Recommended)
```bash
node test-db-connection.js
```

This will verify:
- ✅ MySQL is running
- ✅ Database exists
- ✅ All tables are created
- ✅ Sample data is loaded

### 6️⃣ Start the Application
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 What You'll See

### Home Page - Packages Tab
- **8 Travel Packages** with beautiful cards
- Destinations, transport info, and pricing
- "Book Now" button on each package

### Making a Booking
1. Click "Book Now" on any package
2. Fill in your details (name, email, address)
3. Select a hotel from the dropdown
4. Choose payment method
5. Confirm booking ✅

### My Bookings Tab
- View all your bookings
- See package details, hotel info
- Check payment status
- Track booking status (Confirmed/Pending/Cancelled)

### Analytics Tab
- Total bookings and revenue statistics
- Most popular packages
- Top destinations
- Hotel performance metrics

---

## 📊 Sample Data Included

The database comes pre-loaded with:
- **8 Hotels** (Paris, Bali, Dubai, Maldives, etc.)
- **8 Trip Packages** (Europe, Asia, Americas)
- **16 Destinations** (Eiffel Tower, Taj Mahal, etc.)
- **5 Sample Users**
- **7 Sample Bookings**
- **6 Payment Records**
- **5 Hotel Reviews**

---

## 🔧 Troubleshooting

### "Connection Refused" Error
**Problem:** MySQL is not running

**Solution:**
```bash
# Check if MySQL is running
ps aux | grep mysql

# Start MySQL (choose your OS)
brew services start mysql        # macOS
sudo service mysql start         # Linux
# Or start from Services panel   # Windows
```

### "Access Denied" Error
**Problem:** Wrong MySQL password in .env.local

**Solution:**
1. Find your MySQL password
2. Update `.env.local`:
   ```env
   DB_PASSWORD=correct_password_here
   ```

### "Database Does Not Exist" Error
**Problem:** Database not created yet

**Solution:**
```bash
mysql -u root -p < init.sql
```

### Port 3000 Already in Use
**Problem:** Another app is using port 3000

**Solution:**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
yarn dev -p 3001
```

---

## 💡 Tips

1. **Test database first**: Always run `node test-db-connection.js` before starting the app
2. **Check logs**: If something fails, check the terminal for error messages
3. **Sample data**: Feel free to modify `init.sql` to add your own data
4. **Fresh start**: To reset the database, run `mysql -u root -p < init.sql` again

---

## 🎓 Learning Resources

This project demonstrates:
- **SQL JOIN Queries**: Multi-table joins in real-world scenarios
- **Database Relationships**: Foreign keys, one-to-many, many-to-one
- **Aggregation**: COUNT, SUM, AVG, GROUP BY
- **Next.js API Routes**: RESTful API design
- **Modern React**: Hooks, state management, components
- **Tailwind CSS**: Utility-first styling

---

## 📞 Need Help?

If you encounter any issues:
1. Run the database test: `node test-db-connection.js`
2. Check the README.md for detailed documentation
3. Verify MySQL is running and accessible
4. Ensure all dependencies are installed: `yarn install`

---

**Ready to start building?** Run `yarn dev` and open [http://localhost:3000](http://localhost:3000)! 🚀
