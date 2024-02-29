import { z } from 'zod';

const invalid_type_error = 'Invalid type provided for this field';
const required_error = 'This field cannot be blank';
const too_short_error = 'Value is too short';

export const SignInSchema = z.object({
  username: z
    .string({ invalid_type_error, required_error })
    .regex(/^[a-z]{3,40}$/),
  password: z
    .string({ invalid_type_error, required_error })
    .min(1, too_short_error),
});

export const SignUpSchema = z
  .object({
    email: z
      .string({ invalid_type_error, required_error })
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
    username: z
      .string({ invalid_type_error, required_error })
      .regex(/^[a-z]{3,40}$/),
    lastName: z
      .string({ invalid_type_error, required_error })
      .regex(/^[a-zA-Z\s'-]{1,40}$/),
    firstName: z
      .string({ invalid_type_error, required_error })
      .regex(/^[a-zA-Z\s'-]{1,40}$/),
    password: z
      .string({ invalid_type_error, required_error })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        {
          message:
            'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, one number and one special character.',
        }
      ),
    confirmPassword: z
      .string({ invalid_type_error, required_error })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        {
          message:
            'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, one number and one special character.',
        }
      ),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export const NameSchema = z.object({
  firstName: z
    .string({ invalid_type_error, required_error })
    .regex(/^[a-zA-Z\s'-]{1,40}$/),
  lastName: z
    .string({ invalid_type_error, required_error })
    .regex(/^[a-zA-Z\s'-]{1,40}$/),
  username: z
    .string({ invalid_type_error, required_error })
    .regex(/^[a-z]{3,40}$/),
});

export const EmailSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
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

export const PasswordSchema = z
  .object({
    password: z
      .string({ invalid_type_error, required_error })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        {
          message:
            'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, one number and one special character.',
        }
      ),
    newPassword: z
      .string({ invalid_type_error, required_error })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        {
          message:
            'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, one number and one special character.',
        }
      ),
    confirmNewPassword: z
      .string({ invalid_type_error, required_error })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        {
          message:
            'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, one number and one special character.',
        }
      ),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
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
