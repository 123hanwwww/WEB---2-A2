-- charityevents_db.sql
-- Charity Events Management Website - database schema + seed data
-- PROG2002 Web Development II - Assignment 2

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db;
USE charityevents_db;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE organisations (
  org_id        INT AUTO_INCREMENT PRIMARY KEY,
  org_name      VARCHAR(150) NOT NULL,
  mission       TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  website       VARCHAR(200)
);

CREATE TABLE categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE,
  description   VARCHAR(255)
);

CREATE TABLE events (
  event_id      INT AUTO_INCREMENT PRIMARY KEY,
  event_name    VARCHAR(200) NOT NULL,
  description   TEXT,
  event_date    DATETIME NOT NULL,
  location      VARCHAR(200) NOT NULL,
  goal_amount   DECIMAL(12,2) DEFAULT 0,
  raised_amount DECIMAL(12,2) DEFAULT 0,
  ticket_price  DECIMAL(10,2) DEFAULT 0,
  image_url     VARCHAR(300),
  status        ENUM('active','suspended') DEFAULT 'active',
  category_id   INT NOT NULL,
  org_id        INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (org_id)      REFERENCES organisations(org_id)
);

-- ---------------------------------------------------------------------------
-- Seed data: organisations
-- ---------------------------------------------------------------------------

INSERT INTO organisations (org_name, mission, contact_email, contact_phone, website) VALUES
('Hope Foundation', 'To provide food, shelter and education to underprivileged communities and empower them toward a self-sufficient future.', 'info@hopefoundation.org', '+61 2 8000 1111', 'https://www.hopefoundation.org'),
('Green Earth Alliance', 'To protect and restore the natural environment through conservation, education and community-led sustainability initiatives.', 'contact@greenearthalliance.org', '+61 3 9000 2222', 'https://www.greenearthalliance.org'),
('Community Care Network', 'To connect vulnerable individuals with essential health, housing and social support services within their local communities.', 'hello@communitycare.org', '+61 7 3000 3333', 'https://www.communitycare.org');

-- ---------------------------------------------------------------------------
-- Seed data: categories
-- ---------------------------------------------------------------------------

INSERT INTO categories (category_name, description) VALUES
('Fun Run', 'Outdoor running and walking events that raise funds through registrations and sponsorships.'),
('Gala', 'Formal evening dinners and celebrations for major donors and supporters.'),
('Auction', 'Silent and live auctions of donated goods and experiences.'),
('Concert', 'Music performances where ticket sales support a charitable cause.'),
('Volunteer Drive', 'Hands-on community volunteering and clean-up events.');

-- ---------------------------------------------------------------------------
-- Seed data: events
-- event_date uses NOW() offsets so the past/upcoming mix always works,
-- regardless of when the script is imported.
-- image_url uses public Unsplash CDN links (replace with your own if preferred).
-- ---------------------------------------------------------------------------

INSERT INTO events
(event_name, description, event_date, location, goal_amount, raised_amount, ticket_price, image_url, status, category_id, org_id)
VALUES
-- ----- Upcoming / current events (active) -----
('Charity Fun Run 2026',
 'Join hundreds of runners for a 5km and 10km fun run through the city park. Every registration funds school meal programs for children in need. Bring your family and friends for a morning of fitness and giving back.',
 DATE_ADD(NOW(), INTERVAL 45 DAY),
 'Central Park, Sydney', 25000.00, 8400.00, 35.00,
 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=60',
 'active', 1, 1),

('Annual Charity Gala',
 'An elegant black-tie evening featuring a three-course dinner, live entertainment and inspiring stories from the people your support has helped. Funds raised go directly to community housing programs.',
 DATE_ADD(NOW(), INTERVAL 60 DAY),
 'Grand Ballroom, Hilton Hotel, Melbourne', 60000.00, 22000.00, 250.00,
 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=60',
 'active', 2, 3),

('Silent Art Auction for the Planet',
 'Bid on original artworks and unique experiences donated by local artists. All proceeds support reforestation and ocean clean-up projects across the region.',
 DATE_ADD(NOW(), INTERVAL 20 DAY),
 'City Art Gallery, Brisbane', 30000.00, 10500.00, 20.00,
 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=60',
 'active', 3, 2),

('Benefit Concert Under the Stars',
 'A night of live music from local and national artists. Enjoy great performances while raising funds for youth music and arts education programs.',
 DATE_ADD(NOW(), INTERVAL 75 DAY),
 'Riverside Amphitheatre, Perth', 40000.00, 3000.00, 55.00,
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=60',
 'active', 4, 1),

('Community Cleanup Walk',
 'Help us keep our beaches and parks clean. Gloves, bags and refreshments provided. A free, family-friendly day of action for a healthier planet.',
 DATE_ADD(NOW(), INTERVAL 12 DAY),
 'Sunset Beach Reserve, Gold Coast', 5000.00, 1800.00, 0.00,
 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=60',
 'active', 5, 2),

('Charity Dinner & Silent Auction',
 'An intimate fundraising dinner with a silent auction. This event is currently on hold and will be rescheduled shortly.',
 DATE_ADD(NOW(), INTERVAL 30 DAY),
 'The Heritage Room, Adelaide', 20000.00, 1500.00, 120.00,
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=60',
 'suspended', 2, 3),

-- ----- Past events (active, for history/reference) -----
('Spring Charity Run',
 'Our spring edition fun run raised vital funds for local food banks. Thank you to everyone who participated and volunteered.',
 DATE_SUB(NOW(), INTERVAL 120 DAY),
 'Botanic Gardens, Melbourne', 15000.00, 16800.00, 30.00,
 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=60',
 'active', 1, 1),

('Winter Wonderland Gala',
 'A magical winter-themed gala that brought the community together and exceeded its fundraising target for winter shelter programs.',
 DATE_SUB(NOW(), INTERVAL 200 DAY),
 'Crystal Ballroom, Sydney', 50000.00, 54000.00, 220.00,
 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=60',
 'active', 2, 3),

('Art for Earth Auction',
 'An inspiring auction of nature-themed artwork that funded tree planting across three national parks.',
 DATE_SUB(NOW(), INTERVAL 90 DAY),
 'Riverfront Gallery, Brisbane', 20000.00, 23100.00, 15.00,
 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
 'active', 3, 2),

('Summer Benefit Concert',
 'A sold-out outdoor concert that raised funds for youth music scholarships. Relive the highlights and see the impact you made.',
 DATE_SUB(NOW(), INTERVAL 150 DAY),
 'Harbour Park Stage, Sydney', 35000.00, 32000.00, 45.00,
 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=60',
 'active', 4, 1);
