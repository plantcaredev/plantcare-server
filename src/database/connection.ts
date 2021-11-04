import { Pool, Client } from "pg";
require("dotenv").config();

const credentials = {
    user: "",
    host: "",
    database: "",
    password: process.env.SECRET_PASSWORD,
    port: 5432,
};

class DatabaseConnection {
    pool: Pool;
    constructor() {
        this.pool = new Pool(credentials);
    }

    getPool() {
        return this.pool;
    }

    endPool() {
        this.pool.end();
        return true;
    }

    async executeQuery(query: string, values: any[] = []) {
        const resultSet = await this.pool.query(query, values);
        return resultSet;
    }
}

const DefaultDatabaseConnection = new DatabaseConnection();

export async function poolDemo() {
    const now = await DefaultDatabaseConnection.executeQuery("SELECT NOW()");
    return now;
}

export default DefaultDatabaseConnection;
