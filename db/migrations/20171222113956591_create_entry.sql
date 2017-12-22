-- +micrate Up
CREATE TABLE entries (
  id BIGSERIAL PRIMARY KEY,
  api VARCHAR NOT NULL,
  auth VARCHAR DEFAULT NULL,
  category VARCHAR,
  description TEXT,
  https BOOL  NOT NULL,
  link VARCHAR NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS entries;
