import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/error.handler.js";
import routerDriver from "./routes/drivers.js";
import routerWarehouse from "./routes/warehouse.js";
import routerVehicle from "./routes/vehicle.js";
import routerShipment from "./routes/shipment.js";

const app = express();
//dotenv.config();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use("/drivers", routerDriver);
app.use("/warehouse", routerWarehouse);
app.use("/vehicle", routerVehicle)
app.use("/shipment", routerShipment)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(
        `El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`
    );
});