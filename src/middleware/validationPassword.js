const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const student_schema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: joiPassword
    .string()
    .min(6)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .messages({
      "password.minOfUppercase": "{#label} should contain at least {#min} uppercase character",
      "password.minOfSpecialCharacters": "{#label} should contain at least {#min} special character",
      "password.minOfLowercase": "{#label} should contain at least {#min} lowercase character",
      "password.minOfNumeric": "{#label} should contain at least {#min} numeric character",
      "password.noWhiteSpaces": "{#label} should not contain white spaces",
    }),
});

async function validateStudentDetails(object) {
  //console.log('Inside : validateStudentDetails');

  try {
    const value = await student_schema.validateAsync(object);
  } catch (error) {
    throw new Error(error);
  }
}

export default validateStudentDetails;
