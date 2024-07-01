import { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  birthdate: Date,
  created_at: { type: Date, default: Date.now },
  phone: String,
  wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },
  address: String
});

export default userSchema;
