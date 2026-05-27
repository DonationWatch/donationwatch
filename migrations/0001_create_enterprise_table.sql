-- Migration number: 0001 	 2026-05-25T13:29:51.460Z

CREATE TABLE enterprise_waitlist
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    organization  TEXT NOT NULL,
    query_request TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);