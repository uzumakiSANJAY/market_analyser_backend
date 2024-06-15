const mysql = require("mysql2/promise");

let connection;

(async () => {
  connection = mysql.createPool({
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: env.SQL_DATABASE_CONNECTION_LIMIT,
    host: env.SQL_DATABASE_HOST,
    port: env.SQL_DATABASE_PORT,
    user: env.SQL_DATABASE_USER,
    password: env.SQL_DATABASE_PASSWORD,
    database: env.SQL_DATABASE_NAME,
    dateStrings: true,
  });
})()
  .then(() => {
    console.log("MySql Connected");
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`);
    process.exit();
  });

module.exports = { connection };
