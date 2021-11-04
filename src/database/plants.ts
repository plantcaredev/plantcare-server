import httpContext from "express-http-context";
import { IUser } from "../index";
import DatabaseConnection from "./connection";

export async function getPlants() {
    const user: IUser = httpContext.get("user") ?? {};
    if (!user.sub) {
        return [];
    }
    const plants = await DatabaseConnection.executeQuery("select * from plants");
    return plants.rows;
}

export async function getPlantsPub() {
    const plants = await DatabaseConnection.executeQuery("select * from plants");
    return plants.rows;
}
