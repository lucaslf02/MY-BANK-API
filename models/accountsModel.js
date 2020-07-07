import mongoose from "mongoose";

const accountsSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Não é permitido valores negativos");
      }
    },
  },
});

const accountsModel = mongoose.model("account", accountsSchema);

export { accountsModel };
