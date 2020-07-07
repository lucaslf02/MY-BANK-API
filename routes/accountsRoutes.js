import express from "express";
import accountsController from "../controller/accountsController.js"

const accountsRouter = express.Router();

accountsRouter.put("/depositar", accountsController.depositarValor);
accountsRouter.put("/sacar", accountsController.sacarValor);
accountsRouter.put("/transferencia", accountsController.transferencia);
accountsRouter.put("/transfereTopClientes", accountsController.trasnfereTopCliente);
accountsRouter.get("/consultarSaldo", accountsController.consultarSaldo);
accountsRouter.get("/consultaSaldoMediaAgencia/:id", accountsController.mediaSaldoAgencia);
accountsRouter.get("/consultaMenoresSaldos/", accountsController.menoresSaldos);
accountsRouter.get("/consultaMaioresSaldos/", accountsController.maioresSaldos);
accountsRouter.delete("/deletarConta", accountsController.deletarConta);


// accountsRouter.get("/");
// accountsRouter.get("/:id");
// accountsRouter.post("/");
// accountsRouter.delete("/:id");


export{accountsRouter};