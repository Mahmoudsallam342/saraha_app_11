// import Joi from "joi";
// export const login = Joi.object()
//   .keys({
//     email: Joi.string()
//       .email({
//         minDomainSegments: 2,
//         maxDomainSegments: 3,
//         tlds: { allow: ["com", "net"] },
//       })
//       .required(),
//     password: Joi.string().required(),
//   })
//   .required();
// export const signup = login
//   .append()
//   .keys({
//     username: Joi.string().required().messages({
//       "any.required": "username is required",
//       "string.empty": "username cannot be empty",
//     }),

//     confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
//   })
//   .required();
import Joi from "joi";

export const login = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().required(),
}).required();

export const signup = login.keys({
  username: Joi.string().required().messages({
    "any.required": "username is required",
    "string.empty": "username cannot be empty",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "confirm password must match password",
  }),

  phone: Joi.string().required(),
});
