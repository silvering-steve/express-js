import { Schema } from 'mongoose';
import BalanceNotEnoughError from '../errors/BalanceNotEnoughError';

const walletSchema = new Schema(
  {
    balance: Number
  },
  {
    methods: {
      updateBalance(type, amount) {
        if (type === 'IN') this.balance += amount;
        if (type === 'OUT') this.balance -= amount;

        if (this.balance < 0) throw new BalanceNotEnoughError(amount);

        return this;
      }
    }
  }
);

export default walletSchema;
