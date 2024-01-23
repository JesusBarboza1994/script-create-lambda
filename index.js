const fs = require('fs');
const path = require('path');

const estructuraProyecto = [
  'src/',
  'src/controllers/',
  'src/database/',
  'src/database/config.js',
  'src/models/',
  'src/services/',
  'src/utils/',
  '.env',
  'index.js',
  '.gitignore',
];

function crearEstructura(rutaAbsoluta="~/") {
  const rutaBase = path.resolve(rutaAbsoluta);

  estructuraProyecto.forEach(item => {
    const rutaItem = path.join(rutaBase, item);

    if (item.endsWith('/') || item.endsWith('\\')) {
      // Crear carpeta
      if (!fs.existsSync(rutaItem)) {
        fs.mkdirSync(rutaItem);
        console.log(`Carpeta ${item} creada con éxito en ${rutaItem}`);
      } else {
        console.log(`La carpeta ${item} ya existe en ${rutaItem}`);
      }
    } else {
      // Crear archivo
      if (!fs.existsSync(rutaItem)) {
        if (item === 'index.js') {
          // Contenido inicial para index.js
          const contenidoInicial = `
const { connectDatabase } = require('./src/database/config');
const controllers = require('./src/controllers');

module.exports.handler = async (event, _context) => {
  await connectDatabase()
  let response
  return response
}
          `;
          fs.writeFileSync(rutaItem, contenidoInicial);
          console.log(`Archivo ${item} creado con éxito en ${rutaItem}`);
        }else if(item === 'src/database/config.js'){
          const contenidoInicial =`
const mongoose = require('mongoose')
let conn = null
const uri = process.env.DB_URI;
exports.connectDatabase = async () => {
  if (conn == null) {
    conn = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    }).then(() => mongoose);
    await conn;
  }
  console.log("Database connected")
  return conn;
};
          `
          fs.writeFileSync(rutaItem, contenidoInicial);
          console.log(`Archivo ${item} creado con éxito en ${rutaItem}`);
        }else{
          fs.writeFileSync(rutaItem, '');
          console.log(`Archivo ${item} creado con éxito en ${rutaItem}`);
        }
      } else {
        console.log(`El archivo ${item} ya existe en ${rutaItem}`);
      }
    }
  });
}

// Uso: node nombre-de-tu-script.js /ruta/absoluta/del/proyecto
// Ejemplo: node nombre-de-tu-script.js /mi/proyecto/api
const rutaAbsoluta = process.argv[2];

if (!rutaAbsoluta) {
  console.error('Debes proporcionar la ruta absoluta del proyecto.');
  process.exit(1);
}

crearEstructura(rutaAbsoluta);


