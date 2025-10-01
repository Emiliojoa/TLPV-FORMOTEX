import sequelize from "sequelize";

const db = new sequelize.Sequelize("postgres", "postgres", "Formosa2005", {
  host: "localhost",
  dialect: "postgres",
    logging: false,
});

export default db;
