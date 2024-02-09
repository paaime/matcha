import { z } from 'zod';

const invalid_type_error = 'Invalid type provided for this field';
const required_error = 'This field cannot be blank';
const too_short_error = 'Value is too short';

export const SignInSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .email('Please provide a valid email')
    .min(1, too_short_error),
  password: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
});

export const SignUpSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .email('Please provide a valid email')
    .min(1, too_short_error),
  lastName: z
    .string({ invalid_type_error, required_error })
    .min(1, too_short_error),
  firstName: z
    .string({ invalid_type_error, required_error })
    .min(1, too_short_error),
  password: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .email('Please provide a valid email')
    .min(1, too_short_error),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
});

export const ProfileSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .email('Please provide a valid email')
    .min(1, too_short_error),
  lastName: z
    .string({ invalid_type_error, required_error })
    .min(1, too_short_error),
  firstName: z
    .string({ invalid_type_error, required_error })
    .min(1, too_short_error),
});

export const PasswordSchema = z.object({
  password: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
  newPassword: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
  confirmNewPassword: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Password must be at least 6 characters long'),
});

export const SecuritySchema = z.object({
  twoFactor: z.boolean(),
});

export const DigitSchema = z.object({
  digit: z
    .string({ invalid_type_error, required_error })
    .min(6, 'Digit must be 6 characters long')
    .max(6, 'Digit must be 6 characters long'),
});
