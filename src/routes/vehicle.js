import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerVehicle = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const vehiclesFilePath = path.join(_dirname, "../../data/vehicle.json");

const readVehiclesFs = async () => {
    try {
        const vehicles = await fs.readFile(vehiclesFilePath);
        return JSON.parse(vehicles);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeVehiclesFs = async (vehicles) => {
    await fs.writeFile(vehiclesFilePath, JSON.stringify(vehicles, null, 2));
};

routerVehicle.post("/postVehicles", async (req, res) => {
    const vehicles = await readVehiclesFs();
    const newVehicle = {
        id: new Date().getTime(),
        model: req.body.model,
        year: req.body.year,
    };

    vehicles.push(newVehicle);
    await writeVehiclesFs(vehicles);
    res.status(201).send(
        `vehicle created successfully ${JSON.stringify(newVehicle)}`
    );
});

routerVehicle.get("/", async (req, res) => {
    const vehicles = await readVehiclesFs();
    res.json(vehicles);
});

routerVehicle.get("/:vehicleId", async (req, res) => {
    const vehicles = await readVehiclesFs();
    const vehicle = vehicles.find((a) => a.id === parseInt(req.params.vehicleId));
    if (!vehicle) return res.status(404).send("vehicle not found");
    res.json(vehicle);
});

routerVehicle.put("/:id", async (req, res) => {
    const vehicles = await readVehiclesFs();
    const indexVehicle = vehicles.findIndex(
        (a) => a.id === parseInt(req.params.id)
    );
    if (indexVehicle === -1) return res.status(404).send("vehicle not found");
    const updateVehicle = {
        ...vehicles[indexVehicle],
        model: req.body.model,
        year: req.body.year,
    };

    vehicles[indexVehicle] = updateVehicle;
    await writeVehiclesFs(vehicles);
    res.send(`vehicle update successfully ${JSON.stringify(updateVehicle)}`);
});

routerVehicle.delete("/delete/:id", async (req, res) => {
    let vehicles = await readVehiclesFs();
    const vehicle = vehicles.find((a) => a.id === parseInt(req.params.id));
    if (!vehicle) return res.status(404).send("vehicle not found");
    vehicles = vehicles.filter((a) => a.id !== vehicle.id);

    await writeVehiclesFs(vehicles);
    res.send("vehicle deleted successfully");
});

export default routerVehicle;
