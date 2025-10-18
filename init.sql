-- Create Database
CREATE DATABASE IF NOT EXISTS travel_bucket_list;
USE travel_bucket_list;

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Destination;
DROP TABLE IF EXISTS Transport;
DROP TABLE IF EXISTS Hotel;
DROP TABLE IF EXISTS TripPackage;
DROP TABLE IF EXISTS User;

-- Create Tables
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    Pincode VARCHAR(10)
);

CREATE TABLE TripPackage (
    PackageID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    StartDate DATE,
    EndDate DATE,
    Duration INT GENERATED ALWAYS AS (DATEDIFF(EndDate, StartDate)) STORED
);

CREATE TABLE Hotel (
    HotelID INT PRIMARY KEY AUTO_INCREMENT,
    HotelName VARCHAR(100) NOT NULL,
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50),
    Rating DECIMAL(2,1),
    ContactNumber VARCHAR(15)
);

CREATE TABLE Transport (
    TransportID INT PRIMARY KEY AUTO_INCREMENT,
    Type ENUM('Bus','Flight','Train','Cab') NOT NULL,
    ProviderName VARCHAR(100),
    Capacity INT,
    PackageID INT,
    FOREIGN KEY (PackageID) REFERENCES TripPackage(PackageID)
);

CREATE TABLE Booking (
    BookingID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    PackageID INT,
    HotelID INT,
    BookingDate DATE NOT NULL,
    Status ENUM('Confirmed','Pending','Cancelled') DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PackageID) REFERENCES TripPackage(PackageID),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID)
);

CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    BookingID INT,
    Mode ENUM('UPI','Card','NetBanking'),
    Amount DECIMAL(10,2) NOT NULL,
    Status ENUM('Success','Failed','Pending') DEFAULT 'Pending',
    Date DATE,
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
);

CREATE TABLE Review (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    HotelID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    Date DATE,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID)
);

CREATE TABLE Admin (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Role ENUM('SuperAdmin','Manager','Support'),
    HotelID INT,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID)
);

CREATE TABLE Destination (
    DestinationID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50),
    PopularityIndex INT,
    PackageID INT,
    FOREIGN KEY (PackageID) REFERENCES TripPackage(PackageID)
);

-- Insert Sample Data

-- Hotels
INSERT INTO Hotel (HotelName, City, State, Country, Rating, ContactNumber) VALUES
('Grand Palace Hotel', 'Paris', 'Ile-de-France', 'France', 4.8, '+33123456789'),
('Ocean View Resort', 'Bali', 'Bali', 'Indonesia', 4.5, '+62361123456'),
('Mountain Peak Lodge', 'Kathmandu', 'Bagmati', 'Nepal', 4.2, '+9771234567'),
('Desert Oasis Inn', 'Dubai', 'Dubai', 'UAE', 4.9, '+97143456789'),
('Tropical Paradise Resort', 'Maldives', 'Male', 'Maldives', 4.7, '+9603456789'),
('Heritage Palace', 'Jaipur', 'Rajasthan', 'India', 4.3, '+911412345678'),
('Skyline Tower Hotel', 'New York', 'New York', 'USA', 4.6, '+12125551234'),
('Alpine Retreat', 'Zurich', 'Zurich', 'Switzerland', 4.4, '+41445551234');

-- Trip Packages
INSERT INTO TripPackage (Title, Description, Price, StartDate, EndDate) VALUES
('European Cultural Tour', 'Explore the rich history and culture of Europe with visits to iconic landmarks', 2499.99, '2025-07-01', '2025-07-10'),
('Tropical Island Escape', 'Relax on pristine beaches and enjoy water sports in exotic island destinations', 1899.99, '2025-08-15', '2025-08-22'),
('Himalayan Adventure', 'Trek through the majestic Himalayas and experience mountain life', 1599.99, '2025-09-05', '2025-09-14'),
('Desert Safari Experience', 'Discover the beauty of desert landscapes with luxury accommodations', 2299.99, '2025-10-10', '2025-10-17'),
('Southeast Asia Discovery', 'Journey through the diverse cultures and cuisines of Southeast Asia', 1799.99, '2025-06-20', '2025-06-30'),
('Indian Heritage Trail', 'Explore ancient palaces, forts, and temples of incredible India', 1299.99, '2025-11-01', '2025-11-08'),
('American City Explorer', 'Experience the vibrant city life of major American metropolises', 2699.99, '2025-12-15', '2025-12-22'),
('Alpine Winter Wonderland', 'Enjoy skiing and mountain activities in the Swiss Alps', 2999.99, '2026-01-10', '2026-01-18');

-- Destinations
INSERT INTO Destination (Name, City, State, Country, PopularityIndex, PackageID) VALUES
('Eiffel Tower', 'Paris', 'Ile-de-France', 'France', 95, 1),
('Louvre Museum', 'Paris', 'Ile-de-France', 'France', 90, 1),
('Ubud Rice Terraces', 'Ubud', 'Bali', 'Indonesia', 88, 2),
('Tanah Lot Temple', 'Tabanan', 'Bali', 'Indonesia', 85, 2),
('Everest Base Camp', 'Solukhumbu', 'Sagarmatha', 'Nepal', 92, 3),
('Swayambhunath Temple', 'Kathmandu', 'Bagmati', 'Nepal', 80, 3),
('Burj Khalifa', 'Dubai', 'Dubai', 'UAE', 94, 4),
('Desert Safari', 'Dubai', 'Dubai', 'UAE', 89, 4),
('Angkor Wat', 'Siem Reap', 'Siem Reap', 'Cambodia', 93, 5),
('Ha Long Bay', 'Quang Ninh', 'Quang Ninh', 'Vietnam', 87, 5),
('Taj Mahal', 'Agra', 'Uttar Pradesh', 'India', 96, 6),
('Amber Fort', 'Jaipur', 'Rajasthan', 'India', 84, 6),
('Statue of Liberty', 'New York', 'New York', 'USA', 91, 7),
('Times Square', 'New York', 'New York', 'USA', 86, 7),
('Matterhorn', 'Zermatt', 'Valais', 'Switzerland', 90, 8),
('Jungfraujoch', 'Interlaken', 'Bern', 'Switzerland', 88, 8);

-- Transport
INSERT INTO Transport (Type, ProviderName, Capacity, PackageID) VALUES
('Flight', 'Air France', 180, 1),
('Bus', 'Euro Tours', 50, 1),
('Flight', 'Garuda Indonesia', 200, 2),
('Cab', 'Bali Transport', 4, 2),
('Flight', 'Nepal Airlines', 150, 3),
('Bus', 'Mountain Express', 40, 3),
('Flight', 'Emirates', 300, 4),
('Cab', 'Dubai Luxury Cars', 4, 4),
('Flight', 'Vietnam Airlines', 180, 5),
('Bus', 'Asia Explorer', 45, 5),
('Flight', 'Air India', 200, 6),
('Train', 'Indian Railways', 500, 6),
('Flight', 'Delta Airlines', 250, 7),
('Cab', 'NYC Yellow Cab', 4, 7),
('Flight', 'Swiss Air', 160, 8),
('Train', 'Swiss Rail', 200, 8);

-- Sample Users
INSERT INTO User (Name, Email, Phone, Street, City, State, Pincode) VALUES
('John Smith', 'john.smith@email.com', '+1234567890', '123 Main St', 'Boston', 'Massachusetts', '02101'),
('Emma Johnson', 'emma.j@email.com', '+1234567891', '456 Oak Ave', 'Seattle', 'Washington', '98101'),
('Michael Chen', 'michael.chen@email.com', '+1234567892', '789 Pine Rd', 'San Francisco', 'California', '94102'),
('Sarah Williams', 'sarah.w@email.com', '+1234567893', '321 Elm St', 'Chicago', 'Illinois', '60601'),
('David Brown', 'david.b@email.com', '+1234567894', '654 Maple Dr', 'Miami', 'Florida', '33101');

-- Sample Bookings
INSERT INTO Booking (UserID, PackageID, HotelID, BookingDate, Status, TotalAmount) VALUES
(1, 1, 1, '2025-06-01', 'Confirmed', 2499.99),
(2, 2, 2, '2025-06-05', 'Confirmed', 1899.99),
(3, 3, 3, '2025-06-10', 'Confirmed', 1599.99),
(1, 4, 4, '2025-06-12', 'Confirmed', 2299.99),
(4, 5, 2, '2025-06-15', 'Pending', 1799.99),
(5, 6, 6, '2025-06-18', 'Confirmed', 1299.99),
(2, 7, 7, '2025-06-20', 'Confirmed', 2699.99);

-- Sample Payments
INSERT INTO Payment (BookingID, Mode, Amount, Status, Date) VALUES
(1, 'Card', 2499.99, 'Success', '2025-06-01'),
(2, 'UPI', 1899.99, 'Success', '2025-06-05'),
(3, 'NetBanking', 1599.99, 'Success', '2025-06-10'),
(4, 'Card', 2299.99, 'Success', '2025-06-12'),
(6, 'UPI', 1299.99, 'Success', '2025-06-18'),
(7, 'Card', 2699.99, 'Success', '2025-06-20');

-- Sample Reviews
INSERT INTO Review (UserID, HotelID, Rating, Comment, Date) VALUES
(1, 1, 5, 'Absolutely wonderful experience! The hotel staff was amazing and the location perfect.', '2025-06-11'),
(2, 2, 5, 'Best vacation ever! The resort had everything we needed and the beach was stunning.', '2025-06-23'),
(3, 3, 4, 'Great lodge with amazing mountain views. Perfect for trekking enthusiasts.', '2025-06-20'),
(1, 4, 5, 'Luxury at its finest. The desert views were breathtaking.', '2025-06-18'),
(5, 6, 4, 'Beautiful heritage property with excellent service. Highly recommended.', '2025-06-26');

-- Sample Admins
INSERT INTO Admin (Name, Email, Role, HotelID) VALUES
('Alice Manager', 'alice.manager@travelquest.com', 'SuperAdmin', NULL),
('Bob Support', 'bob.support@travelquest.com', 'Support', 1),
('Carol Manager', 'carol.m@travelquest.com', 'Manager', 2);
