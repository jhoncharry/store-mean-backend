const mongoose = require("mongoose");
const chalk = require("chalk");

const databaseConnection = async () => {
  //Conexion base de datos
  await mongoose
    .connect(process.env.DATABASE)
    .then((dataBase) => {
      console.log("======================DATABASE======================");
      console.log(`STATUS:  ${chalk.greenBright("ONLINE")}`);
      console.log(
        `DATABASE: ${chalk.greenBright(dataBase.connections[0].name)}`
      );
    })
    .catch((error) => console.log("Error connecting to MongoDB", error));
};

module.exports = {
  databaseConnection,
};
