import Joi from 'joi';

const LENGTH_OBJECT_ID = 24;

const walletIdValidation = Joi.object({
  walletId: Joi.string().hex().length(LENGTH_OBJECT_ID).required()
});

const walletBodyValidation = Joi.object({
  amount: Joi.number().required().min(0)
});

export { walletIdValidation, walletBodyValidation };
