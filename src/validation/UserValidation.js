import Joi from 'joi';

const LENGTH_OBJECT_ID = 24;

const userIdValidation = Joi.object({
  userId: Joi.string().length(LENGTH_OBJECT_ID).required()
});

const userBodyValidation = Joi.object({
  name: Joi.string().required(),
  birthdate: Joi.date().required(),
  phone: Joi.string().required(),
  wallet: Joi.string().length(LENGTH_OBJECT_ID).hex().required(),
  address: String
});

export { userIdValidation, userBodyValidation };
