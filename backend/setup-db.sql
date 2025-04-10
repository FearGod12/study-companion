-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS study_companion;

-- Create the user with a password
CREATE USER IF NOT EXISTS 'study_companion_user'@'localhost' IDENTIFIED BY 'study_companion_pwd';

-- Grant all privileges on the specific database to the user
GRANT ALL PRIVILEGES ON study_companion.* TO 'study_companion_user'@'localhost';

-- Grant all privileges globally on all databases
GRANT ALL PRIVILEGES ON *.* TO 'study_companion_user'@'localhost' WITH GRANT OPTION;

-- Apply the changes
FLUSH PRIVILEGES;
