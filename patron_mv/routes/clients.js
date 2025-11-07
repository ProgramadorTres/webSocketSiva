import { Router } from "express";

import { ClientController } from "../controllers/clients.js";

export const clientsRouter = Router();

clientsRouter.get("/", ClientController.getAll);
clientsRouter.post("/", ClientController.create);

clientsRouter.delete("/:id", ClientController.delete);
