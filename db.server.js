import sql from "postgres";

import { config } from "dotenv";

config();

if (!process.env.POSTGRESQL_USERNAME || !process.env.POSTGRESQL_PASSWORD) {
	throw new Error("Missing PostgreSQL environment variables");
}
const postgres = sql({
	host: "localhost",
	port: 5432,
	database: "gridhabits",
	username: process.env.POSTGRESQL_USERNAME,
	password: process.env.POSTGRESQL_PASSWORD,
});

export default postgres;
