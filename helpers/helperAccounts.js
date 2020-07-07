import { accountsModel } from "../models/accountsModel.js";

class accountFunctions {
  /*Busca a conta por parametros agencia e conta*/
  async getAccount(agencia, conta) {
    try {
      const account = await accountsModel.find({
        agencia: agencia,
        conta: conta,
      });
      if (!account[0]) {
        throw new Error("Agência e Conta não encontrada");
      }
      return account;
    } catch (err) {
      throw err;
    }
  }

  /*Retira valor da conta */
  async withdraw(agencia, conta, value, tarifa) {
    try {
      const account = await this.getAccount(agencia, conta);
      const { balance, _id } = account[0];
      if (value + tarifa > balance) {
        throw new Error(
          "Conta não possui saldo suficiente para o saque solicitado"
        );
      }
      if (value < 1) {
        throw new Error("Não é posivel sacar um valor menor ou igual a 0");
      }
      const statusWithdraw = await this.deposit(
        agencia,
        conta,
        (value + 1) * -1
      );
      if (!statusWithdraw) {
        throw new Error("Não foi possivel efetuar o saque");
      }

      return {
        agencia: statusWithdraw.agencia,
        conta: statusWithdraw.conta,
        balance: statusWithdraw.balance,
        saque: value,
        tarifa: tarifa,
      };
    } catch (err) {
      throw err;
    }
  }

  /*deposita um valor a partir do id da conta*/
  async deposit(agencia, conta, value) {
    try {
      const account = await this.getAccount(agencia, conta);
      const { _id } = account[0];
      const deposito = await accountsModel.findByIdAndUpdate(
        _id,
        {
          $inc: { balance: value },
        },
        { new: true }
      );
      return deposito;
    } catch (err) {
      throw err;
    }
  }

  /*consulta contas por parametro de agencia*/
  async getAccountsByAgency(agencia) {
    try {
      const accounts = await accountsModel.find({ agencia: agencia });
      if (!accounts[0]) {
        throw new Error("Nâo foram encontrado contas para essa agencia");
      }
      return accounts;
    } catch (err) {
      throw err;
    }
  }

  /*deleta uma conta a partir do id da conta*/
  async deleteAccount(agencia, conta) {
    try {
      const account = await this.getAccount(agencia, conta);
      const { _id: id } = account[0];
      const removeAccount = await accountsModel.findByIdAndDelete(id);

      if (!removeAccount) {
        throw new Error("Erro ao excluir a conta");
      }
      const accountsByAgency = await this.getAccountsByAgency(agencia);
      const qtdeAccounts = accountsByAgency.length;

      return {
        message: `Foi deleta a conta ${conta} da agência ${agencia} com sucesso!`,
        agencia: {
          numero: agencia,
          quatidadeContas: qtdeAccounts,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  /*transferencia entre contas*/
  async transfer(agenciaOri, agenciaDest, contaOri, contaDest, valor) {
    try {
      const tarifa = agenciaOri === agenciaDest ? 0 : 8;
      const retirada = await this.withdraw(agenciaOri, contaOri, valor, tarifa);
      const deposito = await this.deposit(agenciaDest, contaDest, valor);

      const {
        agencia: agenciaOrigem,
        conta: contaOrigem,
        balance: saldoOrigem,
      } = retirada;
      const {
        agencia: agenciaDestino,
        conta: contaDestino,
        balance: saldoDestino,
      } = deposito;

      return {
        origem: {
          agenciaOrigem,
          contaOrigem,
          saldoOrigem,
          valorDebitado: valor,
          tarifa,
        },
        destino: {
          agenciaDestino,
          contaDestino,
          saldoDestino,
          valorCreditado: valor,
        },
      };
    } catch (err) {
      throw err;
    }
  }
  /*Media de saldo por agencia*/
  async avgAgency(agencia) {
    try {
      const agenciaParam = parseInt(agencia);
      const media = await accountsModel.aggregate()
      .match({ agencia: agenciaParam })
      .group({ "_id":{ agencia: "$agencia" }, media: { $avg: "$balance" } });
          
      return media;
    } catch (err) {
      throw err;
    }
  }

  /*consulta top contas, retorna quantidade de contas de acordo com paramtro, 
  define crecente ou descrescente de acordo com parametro*/

  async topAccounts(limit, order){
    try{
      const accounts = await accountsModel.find({},'-_id agencia conta balance').sort({balance: order}).limit(limit);
      return accounts;
    }catch(err){
      throw err;
    }
  }

  async transferTopClients(){
    try{
      const agencias = await accountsModel.distinct("agencia").exec();

      const contaPrivada = [];
      const agenciaPrivada = 99;

      for(let agencia of agencias){
        const contas = await accountsModel
        .findOneAndUpdate(
          {agencia: agencia},
          {$set: {agencia: agenciaPrivada}},
          {new: true}
          )
        .sort({balance: -1});

        contaPrivada.push(contas);
      }
      
      return contaPrivada
    }catch(err){
      throw err;
    }
  }
}

export default new accountFunctions();
