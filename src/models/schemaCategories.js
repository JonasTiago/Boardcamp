import joi from "joi";

const categorieSchema = joi.object({
  name: joi.string().min(3).required(),
});

export default categorieSchema;
