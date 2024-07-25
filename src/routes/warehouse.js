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
routerWarehouse.post("/", async (req, res) => {
    const warehouses = await readWarehousesFs();
    const newWarehouse = {
        id: new Date().getTime(),
        name: req.body.name,
        location: req.body.location,
    };

    warehouses.push(newWarehouse);
    await writeWarehousesFs(warehouses);
    res.status(201).send(
        `Warehouse created successfully ${JSON.stringify(newWarehouse)}`
    );
});

routerWarehouse.get("/", async (req, res) => {
    const warehouses = await readWarehousesFs();
    res.json(warehouses)
})

routerWarehouse.get("/:warehouseId", async (req, res) => {
    const warehouses = await readWarehousesFs();
    const warehouse = warehouses.find((warehouse) => warehouse.id === Number(req.params.warehouseId));
    if (!warehouse) return res.status(404).send("warehouse not found")
    res.json(warehouse)
})

routerWarehouse.put("/:id", async (req, res) => {
    const warehouses = await readWarehousesFs()
    const indexWarehouse = warehouses.findIndex(
        (a) => a.id === parseInt(req.params.id)
    )
    if (indexWarehouse === -1) return res.status(404).send("warehouse not found")
    const updateWarehouse = {
        ...warehouses[indexWarehouse],
        name: req.body.name,
        location: req.body.location,
    }
    warehouses[indexWarehouse] = updateWarehouse
    await writeWarehousesFs(warehouses)
    res.send(`Warehouse update successfully ${JSON.stringify(updateWarehouse)}`);
})

routerWarehouse.delete("/delete/:id", async (req, res) => {
    let warehouses = await readWarehousesFs()
    const warehouse = warehouses.find(a => a.id === parseInt(req.params.id))
    if (!warehouse) return res.status(404).send("warehouse not found")
    warehouses = warehouses.filter(a => a.id !== warehouse.id)

    await writeWarehousesFs(warehouses)
    res.send(`Warehouse deleted successfully`);
})

export default routerWarehouse;