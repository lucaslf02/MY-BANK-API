import mongoose from "mongoose";
import dotenv from 'dotenv';


/*Inicia variaveis de ambiente*/
dotenv.config();
/*varaiveis para acesso ao mongoDB*/
const dbName = process.env.DB_NAME;
const userDB = process.env.USER_DB;
const passwordDB = process.env.PASSWORD_DB;
const connectionPath = `mongodb+srv://${userDB}:${passwordDB}@primeiroprojeto.z1rts.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

/*Cria function para conectar ao db*/
const connectBD = (async () => {
  try {
    await mongoose.connect(connectionPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to the database!");
  } catch (err) {
    console.log(err.message);
  }
});

export {connectBD}