import { ClientModel } from "../models/mysql/clients.js";

import { validateClient, validatePartialClient } from "../schemas/clients.js";
import { ApiResponse } from "../config/formatResponse.js";
import { formatErrorResponse } from "../config/badRequest.js";
import { log } from "console";
export class ClientController {
  static async getAll(req, res) {
    try {
      const { identificacion } = req.query;
      const movies = await ClientModel.getAll({ identificacion });
      if (movies.data.length >= 1) {
        console.log("Entraaa");

        ApiResponse.result = true;
        ApiResponse.message = "";
        ApiResponse.data = movies;
        return res.json(ApiResponse);
      } else {
        ApiResponse.result = false;
        ApiResponse.data = [];
        ApiResponse.message = "No se encontraron registros";
        return res.status(404).json(ApiResponse);
      }
    } catch (error) {
      ApiResponse.result = false;
      ApiResponse.message = error.message;
      ApiResponse.data = [];
      return res.status(404).json(ApiResponse);
    }
  }

  static async create(req, res) {
    try {
      const result = validateClient(req.body);
      console.info(result);
      if (!result.success) {
        const errorResponse = JSON.parse(result.error.message);
        ApiResponse.result = false;
        ApiResponse.data = [];
        ApiResponse.message = formatErrorResponse(errorResponse);
        return res.status(400).json(ApiResponse);
      }

      const newClient = await ClientModel.create({ input: result.data });

      ApiResponse.data = newClient;
      ApiResponse.message = "Cliente creado correctamente.";
      ApiResponse.result = true;
      return res.status(201).json(ApiResponse);
    } catch (e) {
      ApiResponse.result = false;
      ApiResponse.message = e.message;
      ApiResponse.data = [];
      return res.status(409).json(ApiResponse);
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = await ClientModel.delete({ id });

    if (result === false) {
      ApiResponse.result = false;
      ApiResponse.message = "Cliente no existe.";
      ApiResponse.data = [];
      res.status(404).json(ApiResponse);
    }
    ApiResponse.result = true;
    ApiResponse.message = "Cliente eliminado.";
    ApiResponse.data = "";
    return res.json(ApiResponse);
  }

  static async update(req, res) {
    try {
      const result = validatePartialClient(req.body);

      if (!result.success) {
        const errorResponse = JSON.parse(result.error.message);
        ApiResponse.result = false;
        ApiResponse.message = formatErrorResponse(errorResponse);
        ApiResponse.data = [];
        return res.status(400).json(ApiResponse);
      }

      const { id } = req.params;
      const updatedClient = await ClientModel.update({
        id,
        input: result.data,
      });
      ApiResponse.data = updatedClient;
      ApiResponse.message = "Cliente actualizado correctamente.";
      ApiResponse.result = true;
      returnres.status(200).json(ApiResponse);
    } catch (error) {
      ApiResponse.result = false;
      ApiResponse.message = formatErrorResponse(errorResponse);
      ApiResponse.data = [];
      return res.status(404).json(ApiResponse);
    }
  }
}
