
import path from 'path'
import fs from 'fs'
const proyect_structure = [
  'src/',
  'src/db/',
  'src/db/index.js',
  'src/handlers/',
  'src/utils/',
  'src/models/',
  'src/services/',
  'src/constants/',
  'src/middlewares/',
  'index.js',
  '.env',
  '.gitignore'
]



function createStructure(absolute_route = "~/samishop/apis/lambda" ){
  const set_database = process.argv[3] === '--db' //--> Conexión a base de datos (--db)
  
  const base_route = path.resolve(absolute_route)
  proyect_structure.forEach(item=>{
    const item_route = path.join(base_route, item)
    let initial_content = ''
    if(item.endsWith('/') || item.endsWith('\\')){
      if(!fs.existsSync(item_route)){
        if(!set_database && item === 'src/db/') return
        fs.mkdirSync(item_route)
        console.log(`Carpeta ${item} creada con exito en ${item_route}`)
      }else{
        console.log(`La carpeta ${item} ya existe en ${item_route}`)
      }
    }else{
      if(!fs.existsSync(item_route)){
        if(item === 'index.js'){
          const database = `
const mongooseInit = async () => {
  await connectToDatabase();
}

const mongooseStarted = mongooseInit();          
          `

          initial_content = `
import https from 'https';
${set_database && "import { connectToDatabase } from './src/db/index.js'"}
${set_database && database }

export const handler = async (event, context) => {
  try{
    ${set_database && "await mongooseStarted"}

    //...Insert code here

    
    const response = {
      statusCode: httpStatus.OK,
      body: JSON.stringify({ message: 'Función Lambda ejecutada con éxito' }),
    };
    return response;
  }catch(error){
    console.log(error)
    const error_response = {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: 'Hubo un error en la función Lambda' }),
    };

    return error_response;
  }
}
          `

        }
        if(set_database){
          if(item === 'src/db/index.js'){
            initial_content = `
import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI;
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};
            `
          }
        }
        if(item === '.gitignore'){
          initial_content = `
node_modules
.env
          `      
        }
        fs.writeFileSync(item_route, initial_content)
        console.log(`Archivo ${item} creado con exito en ${item_route}`)
      }else{
        console.log(`El archivo ${item} ya existe en ${item_route}`)
      }
    }
  })
}

const absolute_path = process.argv[2];

if (!absolute_path) {
  console.error('Debes proporcionar la ruta absoluta del proyecto.');
  process.exit(1);
}

createStructure(absolute_path);


