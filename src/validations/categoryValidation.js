import { Joi, Segments } from 'celebrate';

export const getAllCategoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(4).max(6).default(6),
  }),
};