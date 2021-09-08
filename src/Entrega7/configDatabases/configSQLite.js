const path = require("path");

const configSQLite = {
  client: "sqlite3",
  connection: { filename: path.join(__dirname, "../DB/ecommerce.sqlite") },
  useNullAsDefault: true,
};

module.exports = { configSQLite };
