CREATE TABLE IF NOT EXISTS users (
	user_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	firebase_uid varchar(255) UNIQUE;
	username varchar(20) NOT NULL UNIQUE,
	email varchar(255) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	theme boolean NOT NULL DEFAULT true,
	color_id int NOT NULL DEFAULT 0,
	privacy int NOT NULL DEFAULT 0
);

-- CREATE TABLE IF NOT EXISTS friendships (
-- 	friendship_id SERIAL PRIMARY KEY,
-- 	user_id_1 int NOT NULL,
-- 	user_id_2 int NOT NULL 

-- )

CREATE TABLE IF NOT EXISTS habits (
	habit_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id int REFERENCES users(user_id) ON DELETE CASCADE,
	title varchar(32) NOT NULL,
	goal NUMERIC(10, 2) DEFAULT 1.0 NOT NULL,
	color_id int NOT NULL DEFAULT -1
);

CREATE TABLE IF NOT EXISTS habit_entries (
	entry_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	habit_id int REFERENCES habits(habit_id) ON DELETE CASCADE,
	entry_date DATE NOT NULL,
	completion NUMERIC(10, 2) DEFAULT 0.0 NOT NULL,
	note varchar(255)
);