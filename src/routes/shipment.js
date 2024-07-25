import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerShipment = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const shipmentsFilePath = path.join(_dirname, "../../data/shipment.json");

const readShipmentsFs = async () => {
    try {
        const shipments = await fs.readFile(shipmentsFilePath);
        return JSON.parse(shipments);
    } catch (err) {
        //throw new Error(`Error en la promesa ${err.message}`);
    }
};

const writeShipmentsFs = async (shipments) => {
    await fs.writeFile(shipmentsFilePath, JSON.stringify(shipments, null, 2));
};

routerShipment.post("/", async (req, res) => {
    const warehousesUrl = await fetch(`http://localhost:3010/warehouse/${req.body.warehouseId}`);
    const shipments = await readShipmentsFs();
    const newShipment = {
        id: new Date().getTime(),
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: await warehousesUrl.json()
    };
    shipments.push(newShipment);
    await writeShipmentsFs(shipments);
    res.status(201).send(`Shipment created successfully ${JSON.stringify(newShipment)}`);
});

routerShipment.get("/", async (req, res) => {
    const shipments = await readShipmentsFs();
    res.json(shipments);
});

routerShipment.get("/:shipmentId", async (req, res) => {
    const shipments = await readShipmentsFs();
    const shipment = shipments.find(
        (a) => a.id === parseInt(req.params.shipmentId)
    );
    if (!shipment) return res.status(404).send("shipment not found");
    res.json(shipment);
});

routerShipment.put("/:id", async (req, res) => {
    const warehousesUrl = await fetch(
        `http://localhost:3010/warehouses/${req.body.warehouseId}`
    );
    const shipments = await readShipmentsFs();
    const indexShipment = shipments.findIndex(
        (a) => a.id === parseInt(req.params.id)
    );
    if (indexShipment === -1) return res.status(404).send("shipment not found");
    const updateShipment = {
        ...shipments[indexShipment],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: await warehousesUrl.json(),
    };

    shipments[indexShipment] = updateShipment;
    await writeShipmentsFs(shipments);
    res.send(`shipment update successfully ${JSON.stringify(updateShipment)}`);
});

routerShipment.delete("/delete/:id", async (req, res) => {
    let shipments = await readShipmentsFs();
    const shipment = shipments.find((a) => a.id === parseInt(req.params.id));
    if (!shipment) return res.status(404).send("shipment not found");
    shipments = shipments.filter((a) => a.id !== shipment.id);

    await writeShipmentsFs(shipments);
    res.send("shipment deleted successfully");
});

export default routerShipment;
