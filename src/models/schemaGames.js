import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().min(3).required(),
  image: joi.string().min(3).required(),
  stockTotal: joi.number().min(1).required(),
  categoryId: joi.number().min(1).required(),
  pricePerDay: joi.number().min(1).required(),
});

export default gameSchema;
