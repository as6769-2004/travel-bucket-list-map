CREATE DATABASE IF NOT EXISTS travel_bucket_list;
USE travel_bucket_list;

-- TravelQuest Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Transport;
DROP TABLE IF EXISTS Hotel;
DROP TABLE IF EXISTS TripPackage;
DROP TABLE IF EXISTS Destination;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Admin;

-- Create tables with proper indexing

--- User Table ---
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  pincode VARCHAR(10),
  profile_picture VARCHAR(255),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  travel_preferences JSON,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
);

--- Admin Table ---
CREATE TABLE Admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_email (email)
);

--- Destination Table ---
CREATE TABLE Destination (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_destination_country (country),
  INDEX idx_destination_popularity (popularity_score)
);

--- TripPackage Table ---
CREATE TABLE TripPackage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in days',
  max_travelers INT NOT NULL DEFAULT 10,
  image_url VARCHAR(255),
  includes_flight BOOLEAN DEFAULT FALSE,
  includes_hotel BOOLEAN DEFAULT TRUE,
  includes_meals BOOLEAN DEFAULT FALSE,
  includes_activities BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES Destination(id) ON DELETE CASCADE,
  INDEX idx_package_price (price),
  INDEX idx_package_duration (duration),
  INDEX idx_package_rating (rating),
  INDEX idx_package_featured (is_featured)
);

--- Hotel Table ---
CREATE TABLE Hotel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  star_rating INT NOT NULL DEFAULT 3,
  amenities JSON,
  image_url VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES Destination(id) ON DELETE CASCADE,
  INDEX idx_hotel_price (price_per_night),
  INDEX idx_hotel_rating (star_rating)
);

--- Transport Table ---
CREATE TABLE Transport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT,
  type ENUM('flight', 'train', 'bus', 'car') NOT NULL,
  provider VARCHAR(100) NOT NULL,
  departure_location VARCHAR(100) NOT NULL,
  arrival_location VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES Destination(id) ON DELETE SET NULL,
  INDEX idx_transport_type (type),
  INDEX idx_transport_price (price)
);

--- Booking Table ---
CREATE TABLE Booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  hotel_id INT,
  transport_id INT,
  booking_date DATE NOT NULL,
  travel_date DATE NOT NULL,
  return_date DATE NOT NULL,
  num_travelers INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES TripPackage(id) ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES Hotel(id) ON DELETE SET NULL,
  FOREIGN KEY (transport_id) REFERENCES Transport(id) ON DELETE SET NULL,
  INDEX idx_booking_user (user_id),
  INDEX idx_booking_status (status),
  INDEX idx_booking_dates (travel_date, return_date)
);

--- Payment Table ---
CREATE TABLE Payment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method ENUM('credit_card', 'upi', 'net_banking', 'wallet') NOT NULL,
  transaction_id VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  currency VARCHAR(3) DEFAULT 'INR',
  FOREIGN KEY (booking_id) REFERENCES Booking(id) ON DELETE CASCADE,
  INDEX idx_payment_status (status)
);

--- Review Table ---
CREATE TABLE Review (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT,
  hotel_id INT,
  booking_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES TripPackage(id) ON DELETE SET NULL,
  FOREIGN KEY (hotel_id) REFERENCES Hotel(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES Booking(id) ON DELETE CASCADE,
  INDEX idx_review_rating (rating),
  INDEX idx_review_package (package_id),
  INDEX idx_review_hotel (hotel_id)
);

--- Insert sample data ---

-- Users
INSERT INTO User (username, email, password, full_name) VALUES
('rajsharma', 'raj@example.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'Raj Sharma'),
('priyapatel', 'priya@example.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'Priya Patel'),
('amitgupta', 'amit@example.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'Amit Gupta'),
('sunithakumar', 'sunitha@example.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'Sunitha Kumar'),
('vikassingh', 'vikas@example.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'Vikas Singh');

-- Admins
INSERT INTO Admin (username, email, password, role) VALUES
('admin', 'admin@travelbucketlist.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'admin'),
('superadmin', 'super@travelbucketlist.com', '$2a$10$Yjb4.LKDr8jLB.IVgvXhqOeRfwBPmZijjT7wNlQJ.U1SSjVqO96Uy', 'super_admin');

-- Destinations
INSERT INTO Destination (name, country, description, image_url, latitude, longitude, popularity_score) VALUES
('Goa', 'India', 'Famous beach destination with golden sands, vibrant nightlife, and Portuguese heritage.', 'https://picsum.photos/seed/goa/800/600', 15.2993, 74.1240, 95),
('Jaipur', 'India', 'The Pink City known for magnificent palaces, forts, and vibrant culture of Rajasthan.', 'https://picsum.photos/seed/jaipur/800/600', 26.9124, 75.7873, 90),
('Kerala', 'India', 'God\'s Own Country with serene backwaters, lush greenery, and Ayurvedic traditions.', 'https://picsum.photos/seed/kerala/800/600', 10.8505, 76.2711, 88),
('Varanasi', 'India', 'One of the oldest living cities with spiritual ghats along the sacred Ganges River.', 'https://picsum.photos/seed/varanasi/800/600', 25.3176, 83.0128, 92),
('Agra', 'India', 'Home to the iconic Taj Mahal, Agra Fort, and rich Mughal heritage.', 'https://picsum.photos/seed/agra/800/600', 27.1767, 78.0081, 89),
('Darjeeling', 'India', 'Hill station famous for tea plantations, Himalayan views, and the toy train.', 'https://picsum.photos/seed/darjeeling/800/600', 27.0410, 88.2663, 85),
('Ladakh', 'India', 'High-altitude desert with stunning landscapes, Buddhist monasteries, and adventure activities.', 'https://picsum.photos/seed/ladakh/800/600', 34.1526, 77.5770, 87),
('Andaman Islands', 'India', 'Tropical paradise with pristine beaches, coral reefs, and water activities.', 'https://picsum.photos/seed/andaman/800/600', 11.7401, 92.6586, 82),
('Udaipur', 'India', 'City of Lakes with romantic palaces, boat rides, and Rajasthani culture.', 'https://picsum.photos/seed/udaipur/800/600', 24.5854, 73.7125, 84),
('Dubai', 'UAE', 'Futuristic city with the world\'s tallest building, luxury shopping, and desert adventures.', 'https://picsum.photos/seed/dubai/800/600', 25.2048, 55.2708, 91);

-- Trip Packages
INSERT INTO TripPackage (destination_id, name, description, price, duration, max_travelers, image_url, includes_flight, includes_hotel, includes_meals, includes_activities, rating, is_featured) VALUES
(1, 'Goa Beach Escape', 'Experience the sun, sand, and vibrant nightlife of Goa beaches.', 35999.00, 5, 10, '/images/packages/goa_beaches.jpg', TRUE, TRUE, TRUE, TRUE, 4.7, TRUE),
(2, 'Royal Rajasthan', 'Explore the majestic forts, palaces, and rich culture of Jaipur and Rajasthan.', 42999.00, 7, 8, '/images/packages/royal_rajasthan.jpg', TRUE, TRUE, TRUE, FALSE, 4.8, TRUE),
(3, 'Kerala Backwaters', 'Cruise through serene backwaters and experience Ayurvedic wellness in God\'s Own Country.', 38999.00, 6, 8, '/images/packages/kerala_backwaters.jpg', TRUE, TRUE, TRUE, TRUE, 4.6, FALSE),
(4, 'Spiritual Varanasi', 'Witness the ancient rituals and spiritual essence of India\'s oldest living city.', 29999.00, 4, 6, '/images/packages/varanasi_ghats.jpg', TRUE, TRUE, FALSE, TRUE, 4.5, TRUE),
(5, 'Taj Mahal & Golden Triangle', 'Discover the iconic Taj Mahal and the cultural heritage of Delhi, Agra, and Jaipur.', 45999.00, 6, 12, '/images/packages/golden_triangle.jpg', TRUE, TRUE, TRUE, TRUE, 4.7, TRUE),
(6, 'Darjeeling Tea Trails', 'Explore tea plantations, ride the toy train, and enjoy Himalayan mountain views.', 32999.00, 5, 8, '/images/packages/darjeeling_tea.jpg', TRUE, TRUE, FALSE, TRUE, 4.4, FALSE),
(7, 'Ladakh Adventure', 'Experience the breathtaking landscapes, Buddhist monasteries, and adventure activities.', 52999.00, 8, 6, '/images/packages/ladakh_adventure.jpg', TRUE, TRUE, TRUE, FALSE, 4.9, TRUE),
(8, 'Andaman Island Hopping', 'Discover pristine beaches, coral reefs, and water activities across multiple islands.', 48999.00, 7, 8, '/images/packages/andaman_islands.jpg', TRUE, TRUE, TRUE, TRUE, 4.8, FALSE),
(9, 'Udaipur Lake Palace', 'Experience the romantic city of lakes with boat rides and royal heritage.', 36999.00, 5, 8, '/images/packages/udaipur_lakes.jpg', TRUE, TRUE, FALSE, TRUE, 4.5, FALSE),
(10, 'Dubai from India', 'Enjoy a short international getaway to the glittering city of Dubai.', 65999.00, 6, 8, '/images/packages/dubai_from_india.jpg', TRUE, TRUE, TRUE, TRUE, 4.8, TRUE);

-- Hotels (3 per destination)
INSERT INTO Hotel (destination_id, name, description, address, price_per_night, star_rating, amenities, image_url, latitude, longitude) VALUES
-- Goa Hotels
(1, 'Taj Holiday Village', 'Luxury beachfront resort with Portuguese-inspired architecture and lush gardens.', 'Candolim Beach, Goa, India', 12500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "beach_access": true}', '/images/hotels/taj_goa.jpg', 15.5185, 73.7633),
(1, 'Cidade de Goa', 'Mediterranean-style resort with private beach access and water sports.', 'Vainguinim Beach, Goa, India', 8500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "water_sports": true}', '/images/hotels/cidade_goa.jpg', 15.4611, 73.8021),
(1, 'Grand Hyatt Goa', 'Contemporary luxury resort with multiple dining options and spa.', 'Bambolim Beach, Goa, India', 9500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "beach_access": true}', '/images/hotels/grand_hyatt_goa.jpg', 15.4167, 73.8667),
-- Jaipur Hotels
(2, 'Rambagh Palace', 'Former royal residence converted into a luxury heritage hotel with stunning gardens.', 'Bhawani Singh Road, Jaipur, India', 18000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "heritage_tours": true}', '/images/hotels/rambagh_palace.jpg', 26.8903, 75.8064),
(2, 'ITC Rajputana', 'Modern hotel inspired by traditional Rajasthani architecture and hospitality.', 'Palace Road, Jaipur, India', 7500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "cultural_experiences": true}', '/images/hotels/itc_rajputana.jpg', 26.9239, 75.7879),
(2, 'Fairmont Jaipur', 'Luxury resort with Mughal-inspired architecture and world-class amenities.', 'Riico Kukas, Jaipur, India', 12000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "golf_course": true}', '/images/hotels/fairmont_jaipur.jpg', 26.9850, 75.6950),
-- Kerala Hotels
(3, 'Kumarakom Lake Resort', 'Traditional Kerala-style villas with private pools on the backwaters.', 'Kumarakom, Kerala, India', 14000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "ayurveda": true}', '/images/hotels/kumarakom_resort.jpg', 9.6144, 76.4254),
(3, 'Taj Malabar Resort & Spa', 'Waterfront resort with traditional Kerala architecture and modern luxury.', 'Willingdon Island, Kochi, India', 11000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "backwater_cruises": true}', '/images/hotels/taj_malabar.jpg', 9.9667, 76.2667),
(3, 'Marari Beach Resort', 'Eco-friendly beach resort with traditional Kerala cottages.', 'Mararikulam, Kerala, India', 8500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "beach_access": true}', '/images/hotels/marari_beach.jpg', 9.6000, 76.1500),
-- Varanasi Hotels
(4, 'Taj Ganges', 'Elegant hotel with modern amenities and traditional hospitality near the ghats.', 'Nadesar Palace Grounds, Varanasi, India', 9500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "ghat_tours": true}', '/images/hotels/taj_varanasi.jpg', 25.3284, 83.0148),
(4, 'BrijRama Palace', 'Heritage hotel on the banks of Ganges with traditional architecture.', 'Darbanga Ghat, Varanasi, India', 7500.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "river_view": true}', '/images/hotels/brijrama_varanasi.jpg', 25.3176, 83.0128),
(4, 'Radisson Hotel Varanasi', 'Modern business hotel with contemporary amenities.', 'The Mall, Varanasi, India', 6000.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "business_center": true}', '/images/hotels/radisson_varanasi.jpg', 25.3200, 83.0100),
-- Agra Hotels
(5, 'The Oberoi Amarvilas', 'Luxury hotel with uninterrupted views of the Taj Mahal from every room.', 'Taj East Gate Road, Agra, India', 22000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "taj_views": true}', '/images/hotels/oberoi_amarvilas.jpg', 27.1731, 78.0421),
(5, 'ITC Mughal', 'Luxury hotel inspired by Mughal architecture near Taj Mahal.', 'Taj Ganj, Agra, India', 12000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "mughal_theme": true}', '/images/hotels/itc_mughal.jpg', 27.1750, 78.0400),
(5, 'Trident Agra', 'Contemporary hotel with views of Taj Mahal and modern facilities.', 'Taj Nagri Phase-2, Agra, India', 8500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "taj_proximity": true}', '/images/hotels/trident_agra.jpg', 27.1800, 78.0350),
-- Darjeeling Hotels
(6, 'Mayfair Darjeeling', 'Colonial-style heritage hotel with panoramic Himalayan views.', 'The Mall, Darjeeling, India', 8000.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "mountain_views": true}', '/images/hotels/mayfair_darjeeling.jpg', 27.0473, 88.2631),
(6, 'Windamere Hotel', 'Historic colonial hotel with old-world charm and tea garden views.', 'Observatory Hill, Darjeeling, India', 6500.00, 3, '{"wifi": true, "pool": false, "spa": false, "restaurant": true, "room_service": true, "gym": false, "bar": true, "heritage": true}', '/images/hotels/windamere_darjeeling.jpg', 27.0500, 88.2650),
(6, 'The Elgin Darjeeling', 'Heritage property with Victorian architecture and mountain views.', 'H.D. Lama Road, Darjeeling, India', 7200.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "victorian_style": true}', '/images/hotels/elgin_darjeeling.jpg', 27.0450, 88.2600),
-- Ladakh Hotels
(7, 'The Grand Dragon Ladakh', 'Eco-friendly luxury hotel with solar heating and mountain views.', 'Old Road, Leh, Ladakh, India', 11000.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "eco_friendly": true}', '/images/hotels/grand_dragon.jpg', 34.1642, 77.5848),
(7, 'The Zen Ladakh', 'Boutique hotel with traditional Ladakhi architecture and modern amenities.', 'Changspa Road, Leh, India', 8500.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "traditional_design": true}', '/images/hotels/zen_ladakh.jpg', 34.1650, 77.5800),
(7, 'Hotel Singge Palace', 'Traditional palace hotel with authentic Ladakhi hospitality.', 'Leh Palace Road, Leh, India', 6500.00, 3, '{"wifi": true, "pool": false, "spa": false, "restaurant": true, "room_service": true, "gym": false, "bar": false, "palace_heritage": true}', '/images/hotels/singge_palace.jpg', 34.1600, 77.5850),
-- Andaman Hotels
(8, 'Taj Exotica Andamans', 'Luxury beachfront villas with private pools on Radhanagar Beach.', 'Radhanagar Beach, Havelock Island, Andaman, India', 16500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "diving": true}', '/images/hotels/taj_andamans.jpg', 11.9810, 92.9520),
(8, 'Barefoot at Havelock', 'Eco-friendly resort with sustainable practices and beach access.', 'Beach No. 7, Havelock Island, India', 12000.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "eco_resort": true}', '/images/hotels/barefoot_havelock.jpg', 11.9800, 92.9500),
(8, 'SeaShell Havelock', 'Beachfront resort with water sports and coral reef access.', 'Govind Nagar Beach, Havelock, India', 9500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "water_sports": true}', '/images/hotels/seashell_havelock.jpg', 11.9850, 92.9550),
-- Udaipur Hotels
(9, 'The Leela Palace Udaipur', 'Opulent hotel on the banks of Lake Pichola with stunning City Palace views.', 'Lake Pichola, Udaipur, India', 19000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "lake_view": true}', '/images/hotels/leela_udaipur.jpg', 24.5772, 73.6872),
(9, 'Taj Lake Palace', 'Iconic floating palace hotel in the middle of Lake Pichola.', 'Lake Pichola, Udaipur, India', 25000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": true, "floating_palace": true}', '/images/hotels/taj_lake_palace.jpg', 24.5760, 73.6850),
(9, 'Trident Udaipur', 'Lakeside hotel with traditional Rajasthani architecture and modern amenities.', 'Haridasji Ki Magri, Udaipur, India', 11000.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "lakeside": true}', '/images/hotels/trident_udaipur.jpg', 24.5800, 73.6900),
-- Dubai Hotels
(10, 'Burj Al Arab Jumeirah', 'Iconic sail-shaped luxury hotel offering private beach access and butler service.', 'Jumeirah Beach Road, Dubai, UAE', 35000.00, 7, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "butler_service": true}', '/images/hotels/burj_al_arab.jpg', 25.1414, 55.1852),
(10, 'Atlantis The Palm', 'Luxury resort on Palm Jumeirah with water park and aquarium.', 'Palm Jumeirah, Dubai, UAE', 28000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "water_park": true}', '/images/hotels/atlantis_palm.jpg', 25.1300, 55.1200),
(10, 'Jumeirah Beach Hotel', 'Wave-shaped beachfront hotel with private beach and water sports.', 'Jumeirah Beach Road, Dubai, UAE', 22000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "beach_access": true}', '/images/hotels/jumeirah_beach.jpg', 25.1400, 55.1800);

-- Transport (3+ per destination)
INSERT INTO Transport (destination_id, type, provider, departure_location, arrival_location, price) VALUES
-- Goa Transport
(1, 'flight', 'Air India', 'Delhi', 'Goa', 8500.00),
(1, 'flight', 'IndiGo', 'Mumbai', 'Goa', 6200.00),
(1, 'train', 'Indian Railways', 'Mumbai', 'Goa', 1800.00),
-- Jaipur Transport
(2, 'flight', 'IndiGo', 'Delhi', 'Jaipur', 4200.00),
(2, 'train', 'Indian Railways', 'Delhi', 'Jaipur', 800.00),
(2, 'bus', 'RSRTC', 'Delhi', 'Jaipur', 600.00),
-- Kerala Transport
(3, 'flight', 'SpiceJet', 'Delhi', 'Kochi', 7200.00),
(3, 'train', 'Indian Railways', 'Delhi', 'Kochi', 2200.00),
(3, 'bus', 'KSRTC', 'Bangalore', 'Kochi', 800.00),
-- Varanasi Transport
(4, 'flight', 'Vistara', 'Delhi', 'Varanasi', 6500.00),
(4, 'train', 'Indian Railways', 'Delhi', 'Varanasi', 1500.00),
(4, 'bus', 'UP Roadways', 'Delhi', 'Varanasi', 1000.00),
-- Agra Transport
(5, 'train', 'Indian Railways', 'Delhi', 'Agra', 1200.00),
(5, 'bus', 'UP Roadways', 'Delhi', 'Agra', 800.00),
(5, 'car', 'Ola Outstation', 'Delhi', 'Agra', 3500.00),
-- Darjeeling Transport
(6, 'flight', 'SpiceJet', 'Delhi', 'Bagdogra', 8200.00),
(6, 'train', 'Indian Railways', 'Kolkata', 'New Jalpaiguri', 1800.00),
(6, 'bus', 'WBTC', 'Kolkata', 'Darjeeling', 1200.00),
-- Ladakh Transport
(7, 'flight', 'Air India', 'Delhi', 'Leh', 12000.00),
(7, 'flight', 'IndiGo', 'Mumbai', 'Leh', 14500.00),
(7, 'bus', 'HRTC', 'Delhi', 'Leh', 2500.00),
-- Andaman Transport
(8, 'flight', 'Air India', 'Delhi', 'Port Blair', 15000.00),
(8, 'flight', 'IndiGo', 'Kolkata', 'Port Blair', 12000.00),
(8, 'flight', 'SpiceJet', 'Chennai', 'Port Blair', 8500.00),
-- Udaipur Transport
(9, 'flight', 'Air India', 'Delhi', 'Udaipur', 7500.00),
(9, 'train', 'Indian Railways', 'Delhi', 'Udaipur', 1800.00),
(9, 'bus', 'RSRTC', 'Jaipur', 'Udaipur', 800.00),
-- Dubai Transport
(10, 'flight', 'Emirates', 'Delhi', 'Dubai', 25000.00),
(10, 'flight', 'Air India', 'Mumbai', 'Dubai', 22000.00),
(10, 'flight', 'IndiGo', 'Bangalore', 'Dubai', 24000.00);

-- Bookings
INSERT INTO Booking (user_id, package_id, hotel_id, transport_id, booking_date, travel_date, return_date, num_travelers, total_price, status, special_requests) VALUES
(1, 1, 1, 1, '2023-05-15', '2023-07-10', '2023-07-17', 2, 71998.00, 'completed', 'Anniversary celebration, requesting champagne in room'),
(2, 2, 4, 4, '2023-06-20', '2023-08-05', '2023-08-15', 1, 42999.00, 'completed', 'Vegetarian meals preferred'),
(3, 4, 10, 10, '2023-07-05', '2023-09-10', '2023-09-15', 3, 89997.00, 'completed', 'Early check-in if possible'),
(4, 7, 19, 19, '2023-08-12', '2023-10-20', '2023-10-27', 2, 105998.00, 'confirmed', 'Sunset dinner reservation requested'),
(5, 10, 28, 28, '2023-09-01', '2023-11-15', '2023-11-21', 4, 263996.00, 'confirmed', 'Airport transfer needed');

-- Payments
INSERT INTO Payment (booking_id, amount, payment_date, payment_method, transaction_id, status, currency) VALUES
(1, 71998.00, '2023-05-15 14:30:00', 'credit_card', 'TXN123456789', 'completed', 'INR'),
(2, 42999.00, '2023-06-20 10:15:00', 'upi', 'PP987654321', 'completed', 'INR'),
(3, 89997.00, '2023-07-05 16:45:00', 'credit_card', 'TXN567891234', 'completed', 'INR'),
(4, 105998.00, '2023-08-12 11:20:00', 'credit_card', 'TXN456789123', 'completed', 'INR'),
(5, 263996.00, '2023-09-01 09:30:00', 'net_banking', 'BT123789456', 'completed', 'INR');

-- Reviews
INSERT INTO Review (user_id, package_id, hotel_id, booking_id, rating, comment) VALUES
(1, 1, 1, 1, 5, 'The Goa Beach Escape was fantastic! The Taj Holiday Village was luxurious and the nightlife was great.'),
(2, 2, 4, 2, 5, 'Royal Rajasthan was a majestic trip. The Rambagh Palace felt truly royal and the culture was amazing.'),
(3, 4, 10, 3, 4, 'Varanasi was a spiritual and moving experience. The Taj Ganges was very comfortable. Only downside was the heat.'),
(4, 7, 19, 4, 5, 'Ladakh Adventure was breathtaking! The Grand Dragon was eco-friendly and the mountain views were unforgettable.'),
(5, 10, 28, 5, 4, 'Dubai from India was a short but impressive getaway. Excellent package organization and great sights.');

-- Update package ratings based on reviews
SET SQL_SAFE_UPDATES = 0;

UPDATE TripPackage tp
SET rating = (
  SELECT AVG(r.rating)
  FROM Review r
  WHERE r.package_id = tp.id
  GROUP BY r.package_id
)
WHERE id IN (SELECT DISTINCT package_id FROM Review WHERE package_id IS NOT NULL);

UPDATE Destination d
SET popularity_score = (
  SELECT COALESCE(COUNT(b.id) * 10, 5) 
  FROM Booking b
  JOIN TripPackage tp ON b.package_id = tp.id
  WHERE tp.destination_id = d.id
  GROUP BY tp.destination_id
  LIMIT 1
);

SET SQL_SAFE_UPDATES = 1;