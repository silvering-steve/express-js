import { Schema } from 'mongoose';

const walletSchema = new Schema({
  balance: { type: Number, default: 0 }
});

export default walletSchema;
