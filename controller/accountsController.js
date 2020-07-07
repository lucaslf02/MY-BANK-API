import accountFunctions from "../helpers/helperAccounts.js";

class accountsController {
  /*utilizado na rota depositar*/
  async depositarValor(req, res) {
    try {
      const { agencia, conta, deposito } = req.body;
      if (deposito < 1) {
        throw new Error(
          "Não é permitir depositar valores igual ou menor que zero"
        );
      }

      const statusDeposit = await accountFunctions.deposit(
        agencia,
        conta,
        deposito
      );
      if (statusDeposit) {
        res.status(200).send({
          message: "Deposito efetuado com sucesso",
          saldo: statusDeposit.balance,
        });
      } else {
        res.status(400).send({ error: "Erro ao depositar valor" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }

  /*utilizado na rota sacar*/
  async sacarValor(req, res) {
    try {
      const { agencia, conta, valor } = req.body;
      const statusWithdraw = await accountFunctions.withdraw(
        agencia,
        conta,
        valor,
        1
      );
      res.status(200).send({
        message: "Saque efetuado com sucesso",
        agencia: statusWithdraw.agencia,
        conta: statusWithdraw.conta,
        saque: statusWithdraw.saque,
        saldo: statusWithdraw.balance,
        tarifa: statusWithdraw.tarifa,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }

  /*utilizado na rota consultasaldo*/
  async consultarSaldo(req, res) {
    try {
      const { agencia: agenciaParam, conta: contaParam } = req.body;
      const account = await accountFunctions.getAccount(
        agenciaParam,
        contaParam
      );
      const { agencia, conta, balance } = account[0];
      res.status(200).send({
        agencia,
        conta,
        saldo: balance,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ err: err.message });
    }
  }

  /*utilizado na rota para excluir contas*/
  async deletarConta(req, res) {
    try {
      const { agencia: agenciaParam, conta: contaParam } = req.body;
      const account = await accountFunctions.deleteAccount(
        agenciaParam,
        contaParam
      );
      res.status(200).send(account);
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ erro: err.message });
    }
  }

  /*utilizado na rota para transferencia de valores*/
  async transferencia(req, res) {
    try {
      const {
        agenciaOrigem,
        agenciaDestino,
        contaOrigem,
        contaDestino,
        valor,
      } = req.body;
      const transfer = await accountFunctions.transfer(
        agenciaOrigem,
        agenciaDestino,
        contaOrigem,
        contaDestino,
        valor
      );
      res.status(200).send(transfer);
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ erro: err.message });
    }
  }

  /*utilizado na rota de media por agencia*/
  async mediaSaldoAgencia(req, res) {
    try {
      const agencia = req.params.id;
      const media = await accountFunctions.avgAgency(agencia);
      res.status(200).send(media);
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }
  /*utilizado na rota que define contas com menores saldos*/
  async menoresSaldos(req, res) {
    try {
      const { limit } = req.body;
      const account = await accountFunctions.topAccounts(limit, 1);
      res.status(200).send(account);
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }
  /*utilizado na rota que define contas com maiores saldos*/
  async maioresSaldos(req, res) {
    try {
      const { limit } = req.body;
      const account = await accountFunctions.topAccounts(limit, -1);
      res.status(200).send(account);
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }

  /*utilizado na rota de transferencia dos top clientes pra agencia 99*/
  async trasnfereTopCliente(_,res){
      try{
        const accounts = await accountFunctions.transferTopClients();
        res.status(200).send(accounts);
      }catch(err){
          console.log(err.message);
          res.status(400).send({error: err.message});
      }
  }
}

export default new accountsController();
