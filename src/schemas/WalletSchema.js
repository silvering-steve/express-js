import { Schema } from 'mongoose';

const walletSchema = new Schema({
  balance: Number
});

export default walletSchema;
