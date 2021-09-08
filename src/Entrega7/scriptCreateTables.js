const knex = require("knex");
const { configMariaDB } = require("./configDatabases/configMariaDB.js");
const { configSQLite } = require("./configDatabases/configSQLite.js");

const dbProductos = knex(configMariaDB);
const dbMensajes = knex(configSQLite);

async function tablesCreation() {
  const existP = await dbProductos.schema.hasTable("productos");

  if (!existP) {
    await dbProductos.schema.createTable("productos", (table) => {
      table.increments("id").primary().notNullable()
      table.string("title", 50).notNullable()
      table.decimal("precio").notNullable()
      table.string("thumbnail", 400)
    });
  }

  const existM = await dbMensajes.schema.hasTable("mensajes");
  if (!existM) {
    await dbMensajes.schema.createTable("mensajes", (table) => {
      table.increments("id").primary().notNullable()
      table.string("message", 200).notNullable()
      table.string("email", 50).notNullable()
      table.string("time", 50)
    });
  }
}

module.exports = {tablesCreation}
