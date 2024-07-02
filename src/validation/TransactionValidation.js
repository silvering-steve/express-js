import Joi from 'joi';

const LENGTH_OBJECT_ID = 24;

const transactionBodyValidation = Joi.object({
  walletId: Joi.string().hex().length(LENGTH_OBJECT_ID).required(),
  amount: Joi.date().required(),
  type: Joi.string().valid('IN', 'OUT').required(),
  description: Joi.string()
});

export default transactionBodyValidation;
