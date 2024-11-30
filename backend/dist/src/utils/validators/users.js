import Joi from 'joi';
export const UserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string(),
    category: Joi.string().valid('O level', 'undergraduate', 'graduate').required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    address: Joi.string().required(),
});
export const VerifyEmailValidator = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().length(6).required(),
});
export const UpdateMeValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    category: Joi.string().valid('O level', 'undergraduate', 'graduate'),
    address: Joi.string().required(),
});
export const UpdateAvatarValidator = Joi.object({
    avatar: Joi.string().required(),
});
export const LoginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().max(6).min(6),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
});
