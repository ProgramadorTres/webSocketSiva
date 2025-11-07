import express, { json } from "express";

const app = express();
app.use(json());
app.disable("x-powered-by");

const API = "/api/v1";
const PORT = process.env.PORT || 1234;

// Solo mostrar variables en desarrollo
if (process.env.NODE_ENV !== 'production') {
  console.log("Port: ", process.env.PORTSERVER);
  console.log("Que ves: ", process.env.DBNAME);
  console.log("NODE_ENV: ", process.env.NODE_ENV);
}

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});