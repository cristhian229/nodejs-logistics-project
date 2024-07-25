import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/error.handler.js";
import routerDriver from "./routes/drivers.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use("/drivers", routerDriver);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(
        `El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`
    );
});