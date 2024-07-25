import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerWarehouse = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const warehouseFilePath = path.join(_dirname, "../../data/warehouse.json");

const readWarehousesFs = async () => {
    try {   
        const warehouses = await fs.readFile(warehouseFilePath);
        return JSON.parse(warehouses);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeWarehousesFs = async (warehouses) => {
    await fs.writeFile(warehouseFilePath, JSON.stringify(warehouses,null,2))
}
