import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerDriver = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const driversFilePath = path.join(_dirname, "../../data/drivers.json");

const readDriversFs = async () => {
    try {   
        const drivers = await fs.readFile(driversFilePath);
        return JSON.parse(drivers);
    } catch (err) {
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeDriversFs = async (drivers) => {
    await fs.writeFile(driversFilePath, JSON.stringify(drivers,null,2))
}

routerDriver.post("/postDrivers", async (req, res) => {
    const drivers = await readDriversFs();
    const newDriver = {
        id: drivers.length + 1,
        name: req.body.name,
    };

    drivers.push(newDriver);
    await writeDriversFs(drivers);
    res.status(201).send(
        `Driver created successfully ${JSON.stringify(newDriver)}`
    );
});

routerDriver.get("/", async (req, res) => {
    const drivers = await readDriversFs()
    res.json(drivers)
})

routerDriver.get("/:driverId", async (req, res) => {
    const drivers = await readDriversFs()
    const driver = drivers.find((a) => a.id === parseInt(req.params.driverId));
    if (!driver) return res.status(404).send("driver not found");
    res.json(driver);
})

routerDriver.put("/:id", async (req, res) => {
    const drivers = await readDriversFs();
    const indexDriver = drivers.findIndex(
        (a) => a.id === parseInt(req.params.id)
    );
    if (indexDriver === -1) return res.status(404).send("Driver not found");
    const updateDriver = {
        ...drivers[indexDriver],
        name: req.body.name,
    };

    drivers[indexDriver] = updateDriver;
    await writeDriversFs(drivers);
    res.send(`Driver update successfully ${JSON.stringify(updateDriver)}`);
});

routerDriver.delete("/delete/:id", async (req, res) => {
    let drivers = await readDriversFs();
    const driver = drivers.find(a => a.id === parseInt(req.params.id));
    if(!driver) return res.status(404).send("driver not found");
    drivers = drivers.filter(a => a.id !== driver.id);

    await writeDriversFs(drivers);
    res.send("Driver deleted successfully");

});

export default routerDriver;