import sql from "postgres";

const postgres = sql({
	host: "localhost",
	port: 5432,
	database: "gridhabits",
	username: "postgres",
	password: "waster45",
});

export default postgres;
