-- CREATE TABLE companies (
--     handle text PRIMARY KEY,
--     name text NOT NULL UNIQUE,
--     num_employees INTEGER,
--     description text,
--     logo_url text
-- )

DROP TABLE jobs;

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL,
    equity FLOAT NOT NULL CHECK(equity < 1 AND equity >= 0),
    company_handle TEXT NOT NULL REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted DATE DEFAULT current_timestamp 
)