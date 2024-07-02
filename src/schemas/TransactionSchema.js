import { Schema } from 'mongoose';

const transactionSchema = new Schema({
  amount: Number,
  type: { type: String, enum: ['IN', 'OUT'], default: 'OUT' },
  description: { type: String, default: '-' },
  created_at: { type: Date, default: Date.now },
  wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
});

export default transactionSchema;
