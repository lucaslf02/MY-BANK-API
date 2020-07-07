import express from "express";
import dotenv from 'dotenv';
import {connectBD} from "./models/index.js";
import {accountsRouter} from "./routes/accountsRoutes.js";


/*Inicia variaveis de ambiente*/
dotenv.config();

/*Inicia conexão com banco de dados*/
connectBD();

/*Variaveis para rotas*/
const port = process.env.PORT || 3000;
const app = express();

/*Configurando rotas de API*/
app.use(express.json());
app.use("/accounts", accountsRouter);
app.get("/", (_, res) => {
  res.status(200).send("Api is running!!!");
});

app.listen(port, () => {
  try {
    console.log("API listening  on the port " + port);
  } catch (err) {
    console.log("Erro ao iniciar API: " + err.message);
  }
});



