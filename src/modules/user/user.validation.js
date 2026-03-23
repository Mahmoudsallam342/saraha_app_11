import Joi from "joi";
import { fileFieldValidation } from "../../common/utils/index.js";

export const profileImage = {
  file: Joi.object()
    .keys({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .valid(...Object.values(fileFieldValidation.image))
        .required(),
      finalPath: Joi.string().required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().required(),
    })
    .required(),
};
export const profileCoverImage = {
  files: Joi.array()
    .items(
      Joi.object()
        .keys({
          fieldname: Joi.string().required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          mimetype: Joi.string()
            .valid(...Object.values(fileFieldValidation.image))
            .required(),
          finalPath: Joi.string().required(),
          destination: Joi.string().required(),
          filename: Joi.string().required(),
          path: Joi.string().required(),
          size: Joi.number().required(),
        })
        .required(),
    )
    .min(1)
    .max(5)
    .required(),
};
