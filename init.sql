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
  type ENUM('flight', 'train', 'bus', 'car') NOT NULL,
  provider VARCHAR(100) NOT NULL,
  departure_location VARCHAR(100) NOT NULL,
  arrival_location VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

-- Users (Basic registration data)
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

-- Sample users can complete their profiles after login
-- Profile completion includes: phone, address, emergency contacts, travel preferences, profile picture

-- Destinations (20 Records)
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
('Dubai', 'UAE', 'Futuristic city with the world\'s tallest building, luxury shopping, and desert adventures.', 'https://picsum.photos/seed/dubai/800/600', 25.2048, 55.2708, 91),
('Manali', 'India', 'Popular hill station in Himachal Pradesh with snow-capped mountains and adventure sports.', 'https://picsum.photos/seed/manali/800/600', 32.2396, 77.1887, 86),
('Rishikesh', 'India', 'Yoga capital of the world with spiritual ashrams and river rafting on the Ganges.', 'https://picsum.photos/seed/rishikesh/800/600', 30.0869, 78.2676, 84),
('Hampi', 'India', 'UNESCO World Heritage site with ancient ruins and boulder landscapes.', 'https://picsum.photos/seed/hampi/800/600', 15.3350, 76.4600, 81),
('Shimla', 'India', 'Former British summer capital with colonial architecture and scenic mountain views.', 'https://picsum.photos/seed/shimla/800/600', 31.1048, 77.1734, 83),
('Mysore', 'India', 'City of palaces known for Mysore Palace, silk sarees, and sandalwood.', 'https://picsum.photos/seed/mysore/800/600', 12.2958, 76.6394, 80),
('Pushkar', 'India', 'Holy city in Rajasthan famous for Brahma Temple and camel fair.', 'https://picsum.photos/seed/pushkar/800/600', 26.4899, 74.5511, 78),
('Coorg', 'India', 'Coffee plantation region in Karnataka with misty hills and waterfalls.', 'https://picsum.photos/seed/coorg/800/600', 12.3375, 75.8069, 79),
('Mount Abu', 'India', 'Only hill station in Rajasthan with Dilwara Jain temples and cool climate.', 'https://picsum.photos/seed/mountabu/800/600', 24.5925, 72.7156, 77),
('Ooty', 'India', 'Queen of hill station in Tamil Nadu with tea gardens and toy train.', 'https://picsum.photos/seed/ooty/800/600', 11.4064, 76.6932, 82),
('Munnar', 'India', 'Hill station of Kerala famous for tea plantations and scenic beauty.', 'https://picsum.photos/seed/munnar/800/600', 10.0889, 77.0595, 85);

---

-- Trip Packages (20 Records)
INSERT INTO TripPackage (destination_id, name, description, price, duration, max_travelers, image_url, includes_flight, includes_hotel, includes_meals, includes_activities, rating, is_featured) VALUES
(1, 'Goa Beach Escape', 'Experience the sun, sand, and vibrant nightlife of Goa beaches.', 35999.00, 5, 10, '/images/packages/goa_beaches.jpg', TRUE, TRUE, TRUE, TRUE, 4.7, TRUE),
(2, 'Royal Rajasthan', 'Explore majestic forts, palaces, and rich culture of Jaipur and Rajasthan.', 42999.00, 7, 8, '/images/packages/royal_rajasthan.jpg', TRUE, TRUE, TRUE, FALSE, 4.8, TRUE),
(3, 'Kerala Backwaters', 'Cruise through serene backwaters and experience Ayurvedic wellness in God\'s Own Country.', 38999.00, 6, 8, '/images/packages/kerala_backwaters.jpg', TRUE, TRUE, TRUE, TRUE, 4.6, FALSE),
(4, 'Spiritual Varanasi', 'Witness the ancient rituals and spiritual essence of India\'s oldest living city.', 29999.00, 4, 6, '/images/packages/varanasi_ghats.jpg', TRUE, TRUE, FALSE, TRUE, 4.5, TRUE),
(5, 'Taj Mahal & Golden Triangle', 'Discover the iconic Taj Mahal and the cultural heritage of Delhi, Agra, and Jaipur.', 45999.00, 6, 12, '/images/packages/golden_triangle.jpg', TRUE, TRUE, TRUE, TRUE, 4.7, TRUE),
(6, 'Darjeeling Tea Trails', 'Explore tea plantations, ride the toy train, and enjoy Himalayan mountain views.', 32999.00, 5, 8, '/images/packages/darjeeling_tea.jpg', TRUE, TRUE, FALSE, TRUE, 4.4, FALSE),
(7, 'Ladakh Adventure', 'Experience the breathtaking landscapes, Buddhist monasteries, and adventure activities.', 52999.00, 8, 6, '/images/packages/ladakh_adventure.jpg', TRUE, TRUE, TRUE, FALSE, 4.9, TRUE),
(8, 'Andaman Island Hopping', 'Discover pristine beaches, coral reefs, and water activities across multiple islands.', 48999.00, 7, 8, '/images/packages/andaman_islands.jpg', TRUE, TRUE, TRUE, TRUE, 4.8, FALSE),
(9, 'Udaipur Lake Palace', 'Experience the romantic city of lakes with boat rides and royal heritage.', 36999.00, 5, 8, '/images/packages/udaipur_lakes.jpg', TRUE, TRUE, FALSE, TRUE, 4.5, FALSE),
(10, 'Dubai from India', 'Enjoy a short international getaway to the glittering city of Dubai.', 65999.00, 6, 8, '/images/packages/dubai_from_india.jpg', TRUE, TRUE, TRUE, TRUE, 4.8, TRUE),
(11, 'Manali Mountain Trek', 'Trekking, river rafting, and snow-capped mountain views in Himachal Pradesh.', 31999.00, 5, 10, '/images/packages/manali_trek.jpg', TRUE, TRUE, TRUE, TRUE, 4.6, TRUE),
(12, 'Rishikesh Yoga Retreat', 'Spiritual retreat, yoga classes, and thrilling river rafting on the Ganges.', 28999.00, 4, 6, '/images/packages/rishikesh_yoga.jpg', TRUE, TRUE, TRUE, TRUE, 4.5, FALSE),
(13, 'Hampi Heritage Tour', 'Guided tour of ancient ruins, temples, and bouldering landscapes.', 25999.00, 3, 7, '/images/packages/hampi_heritage.jpg', TRUE, TRUE, FALSE, TRUE, 4.3, FALSE),
(14, 'Shimla Colonial Charm', 'Explore colonial architecture, The Mall road, and scenic mountain railway.', 27999.00, 4, 9, '/images/packages/shimla_colonial.jpg', TRUE, TRUE, FALSE, TRUE, 4.4, FALSE),
(15, 'Mysore Palace Tour', 'Visit the illuminated Mysore Palace and explore the city’s rich cultural heritage.', 24999.00, 3, 8, '/images/packages/mysore_palace.jpg', TRUE, TRUE, FALSE, TRUE, 4.2, FALSE),
(16, 'Pushkar Camel Fair', 'Witness the vibrant camel fair and visit the sacred Brahma Temple (seasonal).', 39999.00, 5, 6, '/images/packages/pushkar_fair.jpg', TRUE, TRUE, TRUE, TRUE, 4.1, FALSE),
(17, 'Coorg Coffee Break', 'Relax in coffee plantations, visit waterfalls, and enjoy misty hill views.', 26999.00, 4, 7, '/images/packages/coorg_coffee.jpg', TRUE, TRUE, FALSE, TRUE, 4.3, FALSE),
(18, 'Mount Abu Temple Visit', 'Visit Dilwara Jain Temples and enjoy the cool climate of the only hill station in Rajasthan.', 33999.00, 4, 8, '/images/packages/mountabu_temples.jpg', TRUE, TRUE, FALSE, TRUE, 4.0, FALSE),
(19, 'Ooty Hill Station Tour', 'Ride the toy train, walk through tea gardens, and enjoy the Queen of Hills.', 29999.00, 5, 9, '/images/packages/ooty_hills.jpg', TRUE, TRUE, TRUE, FALSE, 4.5, FALSE),
(20, 'Munnar Tea Valley Trek', 'Trekking through vast tea plantations and enjoying the panoramic green valleys.', 30999.00, 5, 7, '/images/packages/munnar_trek.jpg', TRUE, TRUE, TRUE, TRUE, 4.6, TRUE);

---

-- Hotels (20 Records)
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

-- Additional Hotels
(4, 'Taj Ganges', 'Elegant hotel with modern amenities and traditional hospitality near the ghats.', 'Nadesar Palace Grounds, Varanasi, India', 9500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "ghat_tours": true}', '/images/hotels/taj_varanasi.jpg', 25.3284, 83.0148),
(5, 'The Oberoi Amarvilas', 'Luxury hotel with uninterrupted views of the Taj Mahal from every room.', 'Taj East Gate Road, Agra, India', 22000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "taj_views": true}', '/images/hotels/oberoi_amarvilas.jpg', 27.1731, 78.0421),
(6, 'Mayfair Darjeeling', 'Colonial-style heritage hotel with panoramic Himalayan views.', 'The Mall, Darjeeling, India', 8000.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "mountain_views": true}', '/images/hotels/mayfair_darjeeling.jpg', 27.0473, 88.2631),
(7, 'The Grand Dragon Ladakh', 'Eco-friendly luxury hotel with solar heating and mountain views.', 'Old Road, Leh, Ladakh, India', 11000.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "eco_friendly": true}', '/images/hotels/grand_dragon.jpg', 34.1642, 77.5848),
(8, 'Taj Exotica Andamans', 'Luxury beachfront villas with private pools on Radhanagar Beach.', 'Radhanagar Beach, Havelock Island, Andaman, India', 16500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "diving": true}', '/images/hotels/taj_andamans.jpg', 11.9810, 92.9520),
(9, 'The Leela Palace Udaipur', 'Opulent hotel on the banks of Lake Pichola with stunning City Palace views.', 'Lake Pichola, Udaipur, India', 19000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "lake_view": true}', '/images/hotels/leela_udaipur.jpg', 24.5772, 73.6872),
(10, 'Burj Al Arab Jumeirah', 'Iconic sail-shaped luxury hotel offering private beach access and butler service.', 'Jumeirah Beach Road, Dubai, UAE', 35000.00, 7, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "butler_service": true}', '/images/hotels/burj_al_arab.jpg', 25.1414, 55.1852),
(11, 'The Himalayan', 'Alpine-style resort in Manali offering river and mountain facing rooms.', 'Hadimba Road, Manali, India', 7800.00, 4, '{"wifi": true, "pool": false, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "river_view": true}', '/images/hotels/himalayan_manali.jpg', 32.2470, 77.1944),
(12, 'Ananda in the Himalayas', 'Luxury destination spa resort focusing on yoga, meditation, and Ayurvedic treatments.', 'The Palace Estate, Narendra Nagar, Rishikesh, India', 25000.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "yoga": true, "meditation": true, "ayurveda": true, "ganges_view": true}', '/images/hotels/ananda_himalayas.jpg', 30.1389, 78.3182),
(13, 'Evolve Back Hampi', 'Luxury resort near Hampi, inspired by the Vijayanagara Empire’s architectural style.', 'Virupapura, Hampi, India', 13500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": false, "bar": false, "heritage_theme": true}', '/images/hotels/evolve_back_hampi.jpg', 15.3359, 76.4670),
(14, 'The Oberoi Cecil', 'Historic colonial-era hotel known for its grand atrium and mountain views.', 'Chaura Maidan, Shimla, India', 11500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "colonial_architecture": true}', '/images/hotels/oberoi_cecil_shimla.jpg', 31.0991, 77.1593),
(15, 'Radisson Blu Plaza Hotel Mysore', 'Modern luxury hotel close to Mysore Palace and city attractions.', 'M.G. Road, Mysore, India', 6500.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "city_access": true}', '/images/hotels/radisson_mysore.jpg', 12.2989, 76.6575),
(16, 'Jagat Palace Hotel', 'Heritage property offering traditional Rajasthani hospitality near Pushkar Lake.', 'Ajmer Road, Pushkar, India', 5500.00, 3, '{"wifi": true, "pool": true, "spa": false, "restaurant": true, "room_service": true, "gym": false, "bar": false, "lake_access": true}', '/images/hotels/jagat_palace.jpg', 26.4950, 74.5520),
(17, 'The Tamara Coorg', 'Luxury cottage resort nestled in a coffee plantation with misty views.', 'Kabbinakad Estate, Napoklu, Coorg, India', 15500.00, 5, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": true, "plantation_tours": true}', '/images/hotels/tamara_coorg.jpg', 12.3385, 75.8110),
(18, 'Hotel Hillock', 'A budget-friendly hotel with excellent service and a view of the Aravalli hills.', 'Main Road, Mount Abu, India', 4500.00, 3, '{"wifi": true, "pool": false, "spa": false, "restaurant": true, "room_service": true, "gym": false, "bar": false, "hill_view": true}', '/images/hotels/hillock_mountabu.jpg', 24.5950, 72.7160),
(19, 'Fortune Resort Sullivan Court', 'A comfortable resort in Ooty offering modern amenities and scenic views.', 'Selbourne Road, Ooty, India', 6000.00, 4, '{"wifi": true, "pool": true, "spa": true, "restaurant": true, "room_service": true, "gym": true, "bar": false, "garden_access": true}', '/images/hotels/fortune_ooty.jpg', 11.4120, 76.7050),
(20, 'Tea County Munnar', 'A Kerala Tourism Development Corporation (KTDC) property amidst tea gardens.', 'KTDC Resort, Munnar, Kerala, India', 7000.00, 3, '{"wifi": true, "pool": false, "spa": false, "restaurant": true, "room_service": true, "gym": false, "bar": false, "tea_garden_access": true}', '/images/hotels/tea_county_munnar.jpg', 10.0860, 77.0600);
-- Transport (50+ Records)
INSERT INTO Transport (type, provider, departure_location, arrival_location, price) VALUES
-- Goa Transport
('flight', 'Air India', 'Delhi', 'Goa', 8500.00),
('flight', 'IndiGo', 'Mumbai', 'Goa', 6200.00),
('flight', 'SpiceJet', 'Bangalore', 'Goa', 5800.00),
('train', 'Indian Railways', 'Mumbai', 'Goa', 1800.00),
('bus', 'Paulo Travels', 'Mumbai', 'Goa', 1200.00),
('car', 'Zoomcar', 'Goa Airport', 'Calangute Beach', 1500.00),

-- Jaipur Transport
('flight', 'IndiGo', 'Delhi', 'Jaipur', 4200.00),
('flight', 'Air India', 'Mumbai', 'Jaipur', 5200.00),
('train', 'Indian Railways', 'Delhi', 'Jaipur', 800.00),
('bus', 'RSRTC', 'Delhi', 'Jaipur', 600.00),
('car', 'Myles', 'Jaipur Airport', 'City Palace', 1200.00),

-- Kerala Transport
('flight', 'SpiceJet', 'Delhi', 'Kochi', 7200.00),
('flight', 'Air India', 'Mumbai', 'Kochi', 6800.00),
('flight', 'IndiGo', 'Bangalore', 'Kochi', 4800.00),
('train', 'Indian Railways', 'Delhi', 'Kochi', 2200.00),
('bus', 'KSRTC', 'Bangalore', 'Kochi', 800.00),

-- Varanasi Transport
('flight', 'Vistara', 'Delhi', 'Varanasi', 6500.00),
('flight', 'IndiGo', 'Mumbai', 'Varanasi', 7200.00),
('train', 'Indian Railways', 'Delhi', 'Varanasi', 1500.00),
('bus', 'UP Roadways', 'Delhi', 'Varanasi', 1000.00),

-- Agra Transport
('train', 'Indian Railways', 'Delhi', 'Agra', 1200.00),
('bus', 'UP Roadways', 'Delhi', 'Agra', 800.00),
('car', 'Ola Outstation', 'Delhi', 'Agra', 3500.00),

-- Darjeeling Transport
('flight', 'SpiceJet', 'Delhi', 'Bagdogra', 8200.00),
('train', 'Indian Railways', 'Kolkata', 'New Jalpaiguri', 1800.00),
('bus', 'WBTC', 'Kolkata', 'Darjeeling', 1200.00),

-- Ladakh Transport
('flight', 'Air India', 'Delhi', 'Leh', 12000.00),
('flight', 'IndiGo', 'Mumbai', 'Leh', 14500.00),
('bus', 'HRTC', 'Delhi', 'Leh', 2500.00),

-- Andaman Transport
('flight', 'Air India', 'Delhi', 'Port Blair', 15000.00),
('flight', 'IndiGo', 'Kolkata', 'Port Blair', 12000.00),
('flight', 'SpiceJet', 'Chennai', 'Port Blair', 8500.00),

-- Udaipur Transport
('flight', 'Air India', 'Delhi', 'Udaipur', 7500.00),
('train', 'Indian Railways', 'Delhi', 'Udaipur', 1800.00),
('bus', 'RSRTC', 'Jaipur', 'Udaipur', 800.00),

-- Dubai Transport
('flight', 'Emirates', 'Delhi', 'Dubai', 25000.00),
('flight', 'Air India', 'Mumbai', 'Dubai', 22000.00),
('flight', 'IndiGo', 'Bangalore', 'Dubai', 24000.00),

-- Manali Transport
('flight', 'Air India', 'Delhi', 'Kullu', 8500.00),
('bus', 'HRTC', 'Delhi', 'Manali', 1500.00),
('car', 'Self Drive', 'Delhi', 'Manali', 4000.00),

-- Rishikesh Transport
('train', 'Indian Railways', 'Delhi', 'Haridwar', 800.00),
('bus', 'Uttarakhand Roadways', 'Delhi', 'Rishikesh', 600.00),
('car', 'Uber Intercity', 'Delhi', 'Rishikesh', 3000.00),

-- Hampi Transport
('flight', 'IndiGo', 'Bangalore', 'Hubli', 4500.00),
('train', 'Indian Railways', 'Bangalore', 'Hospet', 800.00),
('bus', 'KSRTC', 'Bangalore', 'Hampi', 600.00),

-- Shimla Transport
('flight', 'Air India', 'Delhi', 'Shimla', 8000.00),
('train', 'Indian Railways', 'Delhi', 'Kalka', 1200.00),
('bus', 'HRTC', 'Delhi', 'Shimla', 800.00),

-- Mysore Transport
('flight', 'IndiGo', 'Bangalore', 'Mysore', 3500.00),
('train', 'Indian Railways', 'Bangalore', 'Mysore', 300.00),
('bus', 'KSRTC', 'Bangalore', 'Mysore', 450.00),

-- Additional Transport Options
('car', 'Zoomcar', 'Mumbai', 'Pune', 2000.00),
('bus', 'Private Volvo', 'Chennai', 'Bangalore', 800.00),
('train', 'Rajdhani Express', 'Delhi', 'Mumbai', 3500.00);

-- Bookings
INSERT INTO Booking (user_id, package_id, hotel_id, transport_id, booking_date, travel_date, return_date, num_travelers, total_price, status, special_requests) VALUES
(1, 1, 1, 1, '2023-05-15', '2023-07-10', '2023-07-17', 2, 71998.00, 'completed', 'Anniversary celebration, requesting champagne in room'), -- Total price updated to reflect a more realistic package price * 2 travelers (35999*2)
(2, 2, 3, 3, '2023-06-20', '2023-08-05', '2023-08-15', 1, 42999.00, 'completed', 'Vegetarian meals preferred'), -- Total price updated to reflect package price (42999*1)
(3, 4, 6, 8, '2023-07-05', '2023-09-10', '2023-09-15', 3, 89997.00, 'completed', 'Early check-in if possible'), -- Total price updated to reflect package price * 3 travelers (29999*3)
(4, 7, 9, 5, '2023-08-12', '2023-10-20', '2023-10-27', 2, 105998.00, 'confirmed', 'Sunset dinner reservation requested'), -- Total price updated to reflect package price * 2 travelers (52999*2)
(5, 10, NULL, 2, '2023-09-01', '2023-11-15', '2023-11-21', 4, 263996.00, 'confirmed', 'Airport transfer needed'), -- Total price updated to reflect package price * 4 travelers (65999*4)
(1, 5, 7, 7, '2023-09-15', '2023-12-05', '2023-12-11', 2, 91998.00, 'confirmed', 'Late check-out requested'), -- Total price updated to reflect package price * 2 travelers (45999*2)
(2, 8, 10, NULL, '2023-10-10', '2024-01-15', '2024-01-23', 1, 48999.00, 'pending', 'Guided tour of the medina'), -- Total price updated to reflect package price (48999*1)
(3, 3, 5, 3, '2023-11-05', '2024-02-10', '2024-02-18', 2, 77998.00, 'pending', 'High floor room preferred'), -- Total price updated to reflect package price * 2 travelers (38999*2)
(4, 6, 8, 4, '2023-12-01', '2024-03-15', '2024-03-27', 2, 65998.00, 'pending', 'Honeymoon package'), -- Total price updated to reflect package price * 2 travelers (32999*2)
(5, 9, NULL, NULL, '2023-12-20', '2024-02-25', '2024-03-05', 3, 110997.00, 'cancelled', 'Family room needed'); -- Total price updated to reflect package price * 3 travelers (36999*3)

-- Payments (Amounts updated to match Booking total_price)
INSERT INTO Payment (booking_id, amount, payment_date, payment_method, transaction_id, status, currency) VALUES
(1, 71998.00, '2023-05-15 14:30:00', 'credit_card', 'TXN123456789', 'completed', 'INR'),
(2, 42999.00, '2023-06-20 10:15:00', 'upi', 'PP987654321', 'completed', 'INR'),
(3, 89997.00, '2023-07-05 16:45:00', 'credit_card', 'TXN567891234', 'completed', 'INR'),
(4, 105998.00, '2023-08-12 11:20:00', 'credit_card', 'TXN456789123', 'completed', 'INR'),
(5, 263996.00, '2023-09-01 09:30:00', 'net_banking', 'BT123789456', 'completed', 'INR'),
(6, 91998.00, '2023-09-15 15:10:00', 'credit_card', 'TXN789123456', 'completed', 'INR'),
(7, 48999.00, '2023-10-10 13:25:00', 'upi', 'PP456123789', 'pending', 'INR'),
(8, 77998.00, '2023-11-05 10:40:00', 'credit_card', 'TXN321654987', 'pending', 'INR'),
(9, 65998.00, '2023-12-01 14:15:00', 'credit_card', 'TXN654987321', 'pending', 'INR'),
(10, 110997.00, '2023-12-20 11:50:00', 'wallet', 'PP789456123', 'refunded', 'INR');

-- Reviews (Comments updated to align with the Indian destinations/packages)
INSERT INTO Review (user_id, package_id, hotel_id, booking_id, rating, comment) VALUES
(1, 1, 1, 1, 5, 'The Goa Beach Escape was fantastic! The Taj Holiday Village was luxurious and the nightlife was great.'),
(2, 2, 3, 2, 5, 'Royal Rajasthan was a majestic trip. The Rambagh Palace felt truly royal and the culture was amazing.'),
(3, 4, 6, 3, 4, 'Varanasi was a spiritual and moving experience. The Taj Ganges was very comfortable. Only downside was the heat.'),
(4, 7, 9, 4, 5, 'Ladakh Adventure was breathtaking! The Grand Dragon was eco-friendly and the mountain views were unforgettable.'),
(5, 10, NULL, 5, 4, 'Dubai from India was a short but impressive getaway. Excellent package organization and great sights.'),
(1, 5, 7, 6, 4, 'The Golden Triangle package was a great way to see the Taj Mahal and other sites. The Oberoi Amarvilas views were incredible, but the driving between cities was long.'),
(2, 2, 4, 2, 5, 'Second review for the Royal Rajasthan package. Stayed at both the Rambagh Palace and the ITC Rajputana, both provided outstanding service and hospitality.');

-- Update package ratings based on reviews
-- 1. Temporarily disable the safe update mode
SET SQL_SAFE_UPDATES = 0;

-- 2. Run your original UPDATE statements (no change needed here)
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

-- 3. Re-enable the safe update mode (highly recommended)
SET SQL_SAFE_UPDATES = 1;