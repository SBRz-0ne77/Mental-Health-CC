-- Mental Health Counseling Center Database Setup
-- Run this script in your MySQL client (MySQL Workbench, phpMyAdmin, or command line)

-- Create the database
CREATE DATABASE IF NOT EXISTS mental_health_cc;
USE mental_health_cc;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS appointment;
DROP TABLE IF EXISTS doctor;
DROP TABLE IF EXISTS admin;

-- Admin Table
CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctor Table
CREATE TABLE doctor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  specialization VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointment Table
CREATE TABLE appointment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  doctorId INT NOT NULL,
  date DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES admin(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE
);

-- Payment Table
CREATE TABLE payment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  appointmentId INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES admin(id) ON DELETE CASCADE,
  FOREIGN KEY (appointmentId) REFERENCES appointment(id) ON DELETE CASCADE
);

-- Audit table for appointment status changes
CREATE TABLE appointment_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointmentId INT,
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- STORED PROCEDURES FOR ADMIN
-- ========================================

DELIMITER //

-- Create Admin
CREATE PROCEDURE sp_create_admin(IN p_username VARCHAR(50), IN p_password VARCHAR(255), IN p_email VARCHAR(100))
BEGIN
  INSERT INTO admin (username, password, email) VALUES (p_username, p_password, p_email);
END //

-- Get All Admins
CREATE PROCEDURE sp_get_admins()
BEGIN
  SELECT id, username, email, created_at FROM admin ORDER BY created_at DESC;
END //

-- Update Admin
CREATE PROCEDURE sp_update_admin(IN p_id INT, IN p_username VARCHAR(50), IN p_password VARCHAR(255), IN p_email VARCHAR(100))
BEGIN
  UPDATE admin SET username = p_username, password = p_password, email = p_email WHERE id = p_id;
END //

-- Delete Admin
CREATE PROCEDURE sp_delete_admin(IN p_id INT)
BEGIN
  DELETE FROM admin WHERE id = p_id;
END //

-- ========================================
-- STORED PROCEDURES FOR DOCTOR
-- ========================================

-- Create Doctor
CREATE PROCEDURE sp_create_doctor(IN p_username VARCHAR(50), IN p_password VARCHAR(255), IN p_email VARCHAR(100), IN p_specialization VARCHAR(100))
BEGIN
  INSERT INTO doctor (username, password, email, specialization) VALUES (p_username, p_password, p_email, p_specialization);
END //

-- Get All Doctors
CREATE PROCEDURE sp_get_doctors()
BEGIN
  SELECT id, username, email, specialization, created_at FROM doctor ORDER BY created_at DESC;
END //

-- Update Doctor
CREATE PROCEDURE sp_update_doctor(IN p_id INT, IN p_username VARCHAR(50), IN p_password VARCHAR(255), IN p_email VARCHAR(100), IN p_specialization VARCHAR(100))
BEGIN
  UPDATE doctor SET username = p_username, password = p_password, email = p_email, specialization = p_specialization WHERE id = p_id;
END //

-- Delete Doctor
CREATE PROCEDURE sp_delete_doctor(IN p_id INT)
BEGIN
  DELETE FROM doctor WHERE id = p_id;
END //

-- ========================================
-- STORED PROCEDURES FOR APPOINTMENT
-- ========================================

-- Create Appointment
CREATE PROCEDURE sp_create_appointment(IN p_userId INT, IN p_doctorId INT, IN p_date DATETIME, IN p_status VARCHAR(20))
BEGIN
  INSERT INTO appointment (userId, doctorId, date, status) VALUES (p_userId, p_doctorId, p_date, p_status);
END //

-- Get All Appointments
CREATE PROCEDURE sp_get_appointments()
BEGIN
  SELECT a.id, a.userId, a.doctorId, a.date, a.status, a.created_at,
         u.username as user_name, d.username as doctor_name, d.specialization
  FROM appointment a
  JOIN admin u ON a.userId = u.id
  JOIN doctor d ON a.doctorId = d.id
  ORDER BY a.date DESC;
END //

-- Update Appointment
CREATE PROCEDURE sp_update_appointment(IN p_id INT, IN p_userId INT, IN p_doctorId INT, IN p_date DATETIME, IN p_status VARCHAR(20))
BEGIN
  UPDATE appointment SET userId = p_userId, doctorId = p_doctorId, date = p_date, status = p_status WHERE id = p_id;
END //

-- Delete Appointment
CREATE PROCEDURE sp_delete_appointment(IN p_id INT)
BEGIN
  DELETE FROM appointment WHERE id = p_id;
END //

-- ========================================
-- STORED PROCEDURES FOR PAYMENT
-- ========================================

-- Create Payment
CREATE PROCEDURE sp_create_payment(IN p_userId INT, IN p_appointmentId INT, IN p_amount DECIMAL(10,2), IN p_date DATETIME, IN p_status VARCHAR(20))
BEGIN
  INSERT INTO payment (userId, appointmentId, amount, date, status) VALUES (p_userId, p_appointmentId, p_amount, p_date, p_status);
END //

-- Get All Payments
CREATE PROCEDURE sp_get_payments()
BEGIN
  SELECT p.id, p.userId, p.appointmentId, p.amount, p.date, p.status, p.created_at,
         u.username as user_name, a.date as appointment_date, d.username as doctor_name
  FROM payment p
  JOIN admin u ON p.userId = u.id
  JOIN appointment a ON p.appointmentId = a.id
  JOIN doctor d ON a.doctorId = d.id
  ORDER BY p.date DESC;
END //

-- Update Payment
CREATE PROCEDURE sp_update_payment(IN p_id INT, IN p_userId INT, IN p_appointmentId INT, IN p_amount DECIMAL(10,2), IN p_date DATETIME, IN p_status VARCHAR(20))
BEGIN
  UPDATE payment SET userId = p_userId, appointmentId = p_appointmentId, amount = p_amount, date = p_date, status = p_status WHERE id = p_id;
END //

-- Delete Payment
CREATE PROCEDURE sp_delete_payment(IN p_id INT)
BEGIN
  DELETE FROM payment WHERE id = p_id;
END //

DELIMITER ;

-- ========================================
-- TRIGGERS
-- ========================================

DELIMITER //

-- Trigger to log appointment status changes
CREATE TRIGGER trg_appointment_status_update
AFTER UPDATE ON appointment
FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO appointment_audit (appointmentId, old_status, new_status)
    VALUES (OLD.id, OLD.status, NEW.status);
  END IF;
END //

DELIMITER ;

-- ========================================
-- SAMPLE DATA (Optional)
-- ========================================

-- Insert sample admin
INSERT INTO admin (username, password, email) VALUES 
('admin1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin1@example.com');

-- Insert sample doctors
INSERT INTO doctor (username, password, email, specialization) VALUES 
('dr_smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dr.smith@example.com', 'Psychiatry'),
('dr_jones', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dr.jones@example.com', 'Psychology');

-- Insert sample appointments
INSERT INTO appointment (userId, doctorId, date, status) VALUES 
(1, 1, '2024-02-15 10:00:00', 'confirmed'),
(1, 2, '2024-02-20 14:30:00', 'pending');

-- Insert sample payments
INSERT INTO payment (userId, appointmentId, amount, date, status) VALUES 
(1, 1, 150.00, '2024-02-14 09:00:00', 'completed'),
(1, 2, 120.00, '2024-02-19 16:00:00', 'pending');

-- ========================================
-- INDEXES FOR BETTER PERFORMANCE
-- ========================================

CREATE INDEX idx_appointment_user ON appointment(userId);
CREATE INDEX idx_appointment_doctor ON appointment(doctorId);
CREATE INDEX idx_appointment_date ON appointment(date);
CREATE INDEX idx_payment_user ON payment(userId);
CREATE INDEX idx_payment_appointment ON payment(appointmentId);
CREATE INDEX idx_payment_date ON payment(date);

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View for appointment details with user and doctor info
CREATE VIEW v_appointment_details AS
SELECT 
  a.id,
  a.userId,
  a.doctorId,
  a.date,
  a.status,
  u.username as user_name,
  u.email as user_email,
  d.username as doctor_name,
  d.email as doctor_email,
  d.specialization
FROM appointment a
JOIN admin u ON a.userId = u.id
JOIN doctor d ON a.doctorId = d.id;

-- View for payment details with related info
CREATE VIEW v_payment_details AS
SELECT 
  p.id,
  p.userId,
  p.appointmentId,
  p.amount,
  p.date,
  p.status,
  u.username as user_name,
  a.date as appointment_date,
  d.username as doctor_name,
  d.specialization
FROM payment p
JOIN admin u ON p.userId = u.id
JOIN appointment a ON p.appointmentId = a.id
JOIN doctor d ON a.doctorId = d.id;

-- ========================================
-- FUNCTIONS
-- ========================================

DELIMITER //

-- Function to get appointment count by status
CREATE FUNCTION fn_get_appointment_count_by_status(p_status VARCHAR(20))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE count_result INT;
  SELECT COUNT(*) INTO count_result FROM appointment WHERE status = p_status;
  RETURN count_result;
END //

-- Function to get total payments by user
CREATE FUNCTION fn_get_total_payments_by_user(p_userId INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE total_amount DECIMAL(10,2);
  SELECT COALESCE(SUM(amount), 0) INTO total_amount FROM payment WHERE userId = p_userId AND status = 'completed';
  RETURN total_amount;
END //

DELIMITER ;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if tables were created
SHOW TABLES;

-- Check stored procedures
SHOW PROCEDURE STATUS WHERE db = 'mental_health_cc';

-- Check triggers
SHOW TRIGGERS;

-- Check functions
SHOW FUNCTION STATUS WHERE db = 'mental_health_cc';

-- Test sample data
SELECT 'Admin Count:' as info, COUNT(*) as count FROM admin
UNION ALL
SELECT 'Doctor Count:', COUNT(*) FROM doctor
UNION ALL
SELECT 'Appointment Count:', COUNT(*) FROM appointment
UNION ALL
SELECT 'Payment Count:', COUNT(*) FROM payment;

-- Test views
SELECT * FROM v_appointment_details LIMIT 5;
SELECT * FROM v_payment_details LIMIT 5;

-- Test functions
SELECT fn_get_appointment_count_by_status('pending') as pending_appointments;
SELECT fn_get_total_payments_by_user(1) as total_payments_user_1; 