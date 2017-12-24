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

CREATE INDEX ON entries ((lower(api)));
CREATE INDEX ON entries ((lower(description)));
CREATE INDEX ON entries ((lower(category)));

-- +micrate Down
DROP TABLE IF EXISTS entries;
