-- Create databases for each service
CREATE DATABASE papers_db;
CREATE DATABASE comments_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE papers_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE comments_db TO postgres;
