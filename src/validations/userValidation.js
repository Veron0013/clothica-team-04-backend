import { Joi, Segments } from "celebrate";

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).messages({
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    lastName: Joi.string().min(2).max(32).messages({
      "string.min": "Last name must be at least {#limit} characters long",
      "string.max": "Last name cannot exceed {#limit} characters",
    }),
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .messages({
        "string.pattern.base":
          "Phone number must follow the format +380XXXXXXXXX",
      }),
    city: Joi.string().max(32).messages({
      "string.max": "City name cannot exceed {#limit} characters",
    }),
    novaPoshtaBranch: Joi.string().max(64).messages({
      "string.max": "Nova Poshta branch cannot exceed {#limit} characters",
    }),
  }).min(1),
};