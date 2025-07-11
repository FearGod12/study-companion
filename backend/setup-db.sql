-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS study_companion;

-- Create the user with a password
CREATE USER IF NOT EXISTS 'study_companion_user'@'localhost' IDENTIFIED BY 'study_companion_pwd';

-- Grant necessary privileges for Prisma
GRANT ALL PRIVILEGES ON study_companion.* TO 'study_companion_user'@'localhost';
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'study_companion_user'@'localhost';
GRANT INDEX ON study_companion.* TO 'study_companion_user'@'localhost';
GRANT TRIGGER ON study_companion.* TO 'study_companion_user'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
