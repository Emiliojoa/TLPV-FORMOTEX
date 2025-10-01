import sequelize from "./db/batabase";
import Usuario from "./db/user";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito.");

    // Sincronizar el modelo con la base de datos
    await Usuario.sync(); // crea la tabla si no existe

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({ nombre: "Emilio", email: "emilio@mail.com" });
    console.log("Usuario creado:", nuevoUsuario.toJSON());

    // Consultar usuarios
    const usuarios = await Usuario.findAll();
    console.log("Todos los usuarios:", usuarios.map(u => u.toJSON()));

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
