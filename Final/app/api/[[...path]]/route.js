import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET handler
export async function GET(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');

  try {
    // Get all packages with destinations and transport (JOIN)
    if (path === '/packages') {
      const [packages] = await pool.query(`
        SELECT DISTINCT 
          p.PackageID,
          p.Title,
          p.Description,
          p.Price,
          p.StartDate,
          p.EndDate,
          p.Duration
        FROM TripPackage p
        ORDER BY p.PackageID DESC
      `);

      // Get destinations for each package
      for (let pkg of packages) {
        const [destinations] = await pool.query(`
          SELECT DestinationID, Name, City, State, Country, PopularityIndex
          FROM Destination
          WHERE PackageID = ?
        `, [pkg.PackageID]);
        pkg.destinations = destinations;

        const [transports] = await pool.query(`
          SELECT TransportID, Type, ProviderName, Capacity
          FROM Transport
          WHERE PackageID = ?
        `, [pkg.PackageID]);
        pkg.transports = transports;
      }

      return NextResponse.json({ success: true, data: packages });
    }

    // Get single package details with JOIN
    if (path.match(/^\/packages\/\d+$/)) {
      const packageId = path.split('/')[2];
      
      const [packages] = await pool.query(`
        SELECT 
          p.PackageID,
          p.Title,
          p.Description,
          p.Price,
          p.StartDate,
          p.EndDate,
          p.Duration
        FROM TripPackage p
        WHERE p.PackageID = ?
      `, [packageId]);

      if (packages.length === 0) {
        return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
      }

      const packageData = packages[0];

      // Get destinations
      const [destinations] = await pool.query(`
        SELECT DestinationID, Name, City, State, Country, PopularityIndex
        FROM Destination
        WHERE PackageID = ?
      `, [packageId]);
      packageData.destinations = destinations;

      // Get transports
      const [transports] = await pool.query(`
        SELECT TransportID, Type, ProviderName, Capacity
        FROM Transport
        WHERE PackageID = ?
      `, [packageId]);
      packageData.transports = transports;

      return NextResponse.json({ success: true, data: packageData });
    }

    // Get all hotels
    if (path === '/hotels') {
      const [hotels] = await pool.query(`
        SELECT HotelID, HotelName, City, State, Country, Rating, ContactNumber
        FROM Hotel
        ORDER BY Rating DESC
      `);
      return NextResponse.json({ success: true, data: hotels });
    }

    // Get user bookings with JOIN
    if (path.match(/^\/bookings\/user\/\d+$/)) {
      const userId = path.split('/')[3];
      
      const [bookings] = await pool.query(`
        SELECT 
          b.BookingID,
          b.BookingDate,
          b.Status,
          b.TotalAmount,
          u.Name AS UserName,
          u.Email AS UserEmail,
          p.Title AS PackageTitle,
          p.Price AS PackagePrice,
          p.StartDate,
          p.EndDate,
          h.HotelName,
          h.City AS HotelCity,
          h.Rating AS HotelRating
        FROM Booking b
        JOIN User u ON b.UserID = u.UserID
        JOIN TripPackage p ON b.PackageID = p.PackageID
        JOIN Hotel h ON b.HotelID = h.HotelID
        WHERE b.UserID = ?
        ORDER BY b.BookingDate DESC
      `, [userId]);

      // Get payment info for each booking
      for (let booking of bookings) {
        const [payments] = await pool.query(`
          SELECT PaymentID, Mode, Amount, Status, Date
          FROM Payment
          WHERE BookingID = ?
        `, [booking.BookingID]);
        booking.payments = payments;
      }

      return NextResponse.json({ success: true, data: bookings });
    }

    // Get all bookings (admin view) with JOIN
    if (path === '/bookings') {
      const [bookings] = await pool.query(`
        SELECT 
          b.BookingID,
          b.BookingDate,
          b.Status,
          b.TotalAmount,
          u.UserID,
          u.Name AS UserName,
          u.Email AS UserEmail,
          u.Phone AS UserPhone,
          p.PackageID,
          p.Title AS PackageTitle,
          p.Price AS PackagePrice,
          h.HotelID,
          h.HotelName,
          h.City AS HotelCity
        FROM Booking b
        JOIN User u ON b.UserID = u.UserID
        JOIN TripPackage p ON b.PackageID = p.PackageID
        JOIN Hotel h ON b.HotelID = h.HotelID
        ORDER BY b.BookingDate DESC
        LIMIT 100
      `);

      return NextResponse.json({ success: true, data: bookings });
    }

    // Get reviews for a hotel
    if (path.match(/^\/reviews\/hotel\/\d+$/)) {
      const hotelId = path.split('/')[3];
      
      const [reviews] = await pool.query(`
        SELECT 
          r.ReviewID,
          r.Rating,
          r.Comment,
          r.Date,
          u.Name AS UserName
        FROM Review r
        JOIN User u ON r.UserID = u.UserID
        WHERE r.HotelID = ?
        ORDER BY r.Date DESC
      `, [hotelId]);

      return NextResponse.json({ success: true, data: reviews });
    }

    // Admin analytics
    if (path === '/admin/analytics') {
      // Total bookings per destination
      const [bookingsPerDestination] = await pool.query(`
        SELECT 
          d.Name AS Destination,
          d.City,
          COUNT(b.BookingID) AS TotalBookings
        FROM Destination d
        JOIN TripPackage p ON d.PackageID = p.PackageID
        JOIN Booking b ON p.PackageID = b.PackageID
        GROUP BY d.DestinationID, d.Name, d.City
        ORDER BY TotalBookings DESC
        LIMIT 10
      `);

      // Most popular packages
      const [popularPackages] = await pool.query(`
        SELECT 
          p.Title,
          p.Price,
          COUNT(b.BookingID) AS TotalBookings,
          SUM(b.TotalAmount) AS TotalRevenue
        FROM TripPackage p
        LEFT JOIN Booking b ON p.PackageID = b.PackageID
        GROUP BY p.PackageID, p.Title, p.Price
        ORDER BY TotalBookings DESC
        LIMIT 10
      `);

      // Revenue per hotel
      const [revenuePerHotel] = await pool.query(`
        SELECT 
          h.HotelName,
          h.City,
          COUNT(b.BookingID) AS TotalBookings,
          SUM(b.TotalAmount) AS TotalRevenue,
          AVG(h.Rating) AS AverageRating
        FROM Hotel h
        LEFT JOIN Booking b ON h.HotelID = b.HotelID
        GROUP BY h.HotelID, h.HotelName, h.City
        ORDER BY TotalRevenue DESC
      `);

      // Overall statistics
      const [stats] = await pool.query(`
        SELECT 
          COUNT(DISTINCT b.BookingID) AS TotalBookings,
          SUM(b.TotalAmount) AS TotalRevenue,
          AVG(b.TotalAmount) AS AverageBookingValue,
          COUNT(DISTINCT b.UserID) AS TotalUsers
        FROM Booking b
        WHERE b.Status != 'Cancelled'
      `);

      return NextResponse.json({
        success: true,
        data: {
          bookingsPerDestination,
          popularPackages,
          revenuePerHotel,
          stats: stats[0]
        }
      });
    }

    // Get all destinations
    if (path === '/destinations') {
      const [destinations] = await pool.query(`
        SELECT 
          d.DestinationID,
          d.Name,
          d.City,
          d.State,
          d.Country,
          d.PopularityIndex,
          p.Title AS PackageName,
          p.Price AS PackagePrice
        FROM Destination d
        LEFT JOIN TripPackage p ON d.PackageID = p.PackageID
        ORDER BY d.PopularityIndex DESC
      `);

      return NextResponse.json({ success: true, data: destinations });
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: 'Database query failed'
    }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');

  try {
    const body = await request.json();

    // Create or get user
    if (path === '/users') {
      const { name, email, phone, street, city, state, pincode } = body;

      // Check if user exists
      const [existingUsers] = await pool.query(
        'SELECT UserID FROM User WHERE Email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json({ 
          success: true, 
          data: { UserID: existingUsers[0].UserID },
          message: 'User already exists'
        });
      }

      // Create new user
      const [result] = await pool.query(
        `INSERT INTO User (Name, Email, Phone, Street, City, State, Pincode) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, street, city, state, pincode]
      );

      return NextResponse.json({ 
        success: true, 
        data: { UserID: result.insertId },
        message: 'User created successfully'
      });
    }

    // Create booking
    if (path === '/bookings') {
      const { userId, packageId, hotelId, totalAmount } = body;

      const [result] = await pool.query(
        `INSERT INTO Booking (UserID, PackageID, HotelID, BookingDate, Status, TotalAmount) 
         VALUES (?, ?, ?, CURDATE(), 'Pending', ?)`,
        [userId, packageId, hotelId, totalAmount]
      );

      // Get the created booking with JOIN
      const [booking] = await pool.query(`
        SELECT 
          b.BookingID,
          b.BookingDate,
          b.Status,
          b.TotalAmount,
          u.Name AS UserName,
          u.Email AS UserEmail,
          p.Title AS PackageTitle,
          h.HotelName
        FROM Booking b
        JOIN User u ON b.UserID = u.UserID
        JOIN TripPackage p ON b.PackageID = p.PackageID
        JOIN Hotel h ON b.HotelID = h.HotelID
        WHERE b.BookingID = ?
      `, [result.insertId]);

      return NextResponse.json({ 
        success: true, 
        data: booking[0],
        message: 'Booking created successfully'
      });
    }

    // Create payment
    if (path === '/payments') {
      const { bookingId, mode, amount } = body;

      const [result] = await pool.query(
        `INSERT INTO Payment (BookingID, Mode, Amount, Status, Date) 
         VALUES (?, ?, ?, 'Success', CURDATE())`,
        [bookingId, mode, amount]
      );

      // Update booking status to Confirmed
      await pool.query(
        'UPDATE Booking SET Status = "Confirmed" WHERE BookingID = ?',
        [bookingId]
      );

      return NextResponse.json({ 
        success: true, 
        data: { PaymentID: result.insertId },
        message: 'Payment processed successfully'
      });
    }

    // Create review
    if (path === '/reviews') {
      const { userId, hotelId, rating, comment } = body;

      const [result] = await pool.query(
        `INSERT INTO Review (UserID, HotelID, Rating, Comment, Date) 
         VALUES (?, ?, ?, ?, CURDATE())`,
        [userId, hotelId, rating, comment]
      );

      return NextResponse.json({ 
        success: true, 
        data: { ReviewID: result.insertId },
        message: 'Review submitted successfully'
      });
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');

  try {
    const body = await request.json();

    // Update booking status
    if (path.match(/^\/bookings\/\d+$/)) {
      const bookingId = path.split('/')[2];
      const { status } = body;

      await pool.query(
        'UPDATE Booking SET Status = ? WHERE BookingID = ?',
        [status, bookingId]
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Booking updated successfully'
      });
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
