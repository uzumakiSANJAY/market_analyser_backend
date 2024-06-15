const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const { env } = require("./lib/config/server");

const pool = mysql.createPool({
  connectionLimit: 1,
  host: env.SQL_DATABASE_HOST,
  port: env.SQL_DATABASE_PORT,
  user: env.SQL_DATABASE_USER,
  password: env.SQL_DATABASE_PASSWORD,
  database: env.SQL_DATABASE_NAME,
  multipleStatements: true,
});

pool.getConnection(function (error, connection) {
  if (error) throw error;
  const fileName = process.argv[2] ? process.argv[2] : "migration.sql";
  const migrationData = fs
    .readFileSync(path.join(__dirname, `./migrations/${fileName}`))
    .toString();

  // Do something with the connection

  connection.query(migrationData, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log("Query run successfully");

      // Don't forget to release the connection when finished
      pool.releaseConnection(connection);
      exit();
    }
  });
});
