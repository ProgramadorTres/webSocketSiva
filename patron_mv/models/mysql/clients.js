import { connection } from "./conectionMysql.js";

export class ClientModel {
  static async getAll({ identificacion }) {
    try {
      let clients = `SELECT id_cliente,nombre1,nombre2,apellido1,identificacion,celular,direccion
      FROM   clientes `;
      if (identificacion) {
        console.log(identificacion, " Entras");

        //const lowerCaseGenre = identificacion.toLowerCase();
        clients = clients + " WHERE  identificacion = ?;";
        const [result] = await connection.query(clients, identificacion); //desestructuro pq viene dos

        return result;
      }
      const [result] = await connection.query(clients);
      return { data: result, error: null }; // Retornamos datos en un objeto
    } catch (error) {
      return {
        data: null,
        error: `Error al listar clientes: ${error.message}`,
      };
    }
  }

  static async create({ input }) {
    console.log("model create");
    const { nombre1, nombre2, apellido1, identificacion, celular, direccion } =
      input;
    try {
      await connection.query(
        `INSERT INTO clientes (nombre1,nombre2,apellido1,identificacion,celular,direccion)
            VALUES ( ?, ?, ?, ?, ?, ?);`,
        [
          nombre1.toLowerCase(),
          nombre2.toLowerCase(),
          apellido1.toLowerCase(),
          identificacion,
          celular,
          direccion.toLowerCase(),
        ]
      );
    } catch (e) {
      throw new Error(`Error al crear el cliente. ${e.message}`);
    }

    const [clients] = await connection.query(
      `SELECT id_cliente,nombre1,nombre2,apellido1,identificacion,celular,direccion
      FROM   clientes
      WHERE  identificacion = ?;`,
      [identificacion]
    );
    return clients;
  }

  static async delete({ id }) {
    try {
      const [existeCliente] = await connection.query(
        `SELECT id_equipo FROM clientes WHERE id_cliente = ?`,
        [id]
      );

      if (existeCliente.length === 0) {
        return false;
      }
      const removeClient = await connection.query(
        `DELETE FROM clientes  WHERE  id_cliente =? `,
        [id]
      );
    } catch (error) {
      console.log(`Error al eliminar el cliente`);
      return error.message;
    }
  }
}
