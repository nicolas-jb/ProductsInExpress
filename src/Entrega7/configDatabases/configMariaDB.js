const dotenv = require('dotenv');
dotenv.config();

const configMariaDB = {
  client: "mysql2", //mysql valida el nombre y pass
  connection: {
    host: process.env.HOST,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
  },
};

module.exports = {configMariaDB}