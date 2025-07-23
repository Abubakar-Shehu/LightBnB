INSERT INTO users (name, email, password)
VALUES
  ('Alice Johnson', 'alice@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Bob Smith', 'bob@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Carol Lee', 'carol@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code, active
)
VALUES
  (1, 'Downtown Loft', 'A modern loft in downtown.', 'thumb1.jpg', 'cover1.jpg', 15000, 1, 1, 1, 'Canada', '123 King St', 'Toronto', 'ON', 'M5V 1E1', TRUE),
  (2, 'Lakeview Cottage', 'Cozy cottage with a lake view.', 'thumb2.jpg', 'cover2.jpg', 20000, 2, 2, 3, 'Canada', '456 Lake Rd', 'Kelowna', 'BC', 'V1Y 1A1', TRUE),
  (1, 'Urban Condo', 'Stylish condo near amenities.', 'thumb3.jpg', 'cover3.jpg', 18000, 1, 1, 2, 'Canada', '789 Queen St', 'Montreal', 'QC', 'H3Z 2Y7', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
  ('2025-08-01', '2025-08-07', 1, 3),  
  ('2025-09-10', '2025-09-15', 2, 1),  
  ('2025-10-05', '2025-10-12', 3, 2);  

INSERT INTO property_reviews (property_id, guest_id, reservation_id, message, rating)
VALUES
  (1, 2, 1, 'Great place, very clean and central.', 5),
  (2, 1, 2, 'Loved the lake view and peaceful vibe.', 4),
  (3, 3, 3, 'Stylish and comfortable. Would stay again.', 5);
