import { BadRequestException } from "../common/utils/index.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw BadRequestException({
        message: "validation error",
        extra: validationResult.error,
      });
    }
    next();
  };
};
