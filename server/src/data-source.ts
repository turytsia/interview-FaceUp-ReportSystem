import "reflect-metadata"
import { DataSource } from "typeorm"
import { Report } from "./entity/Report"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "db",
    synchronize: true,
    logging: false,
    entities: [Report],
    migrations: [],
    subscribers: [],
})
