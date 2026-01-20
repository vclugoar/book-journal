import { z } from 'zod';

// Password requirements
const PASSWORD_MIN_LENGTH = 8;

// Password validation regex patterns
const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

// Password schema with detailed requirements
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .refine((val) => hasLowercase.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => hasUppercase.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => hasNumber.test(val), {
    message: 'Password must contain at least one number',
  })
  .refine((val) => hasSpecialChar.test(val), {
    message: 'Password must contain at least one special character',
  });

// Email schema
export const emailSchema = z.string().email('Please enter a valid email address');

// Sign up schema
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Sign in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Password requirement checker for UI feedback
export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function checkPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: 'At least 8 characters', met: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'One lowercase letter', met: hasLowercase.test(password) },
    { label: 'One uppercase letter', met: hasUppercase.test(password) },
    { label: 'One number', met: hasNumber.test(password) },
    { label: 'One special character', met: hasSpecialChar.test(password) },
  ];
}

// Password strength calculator
export type PasswordStrength = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  label: string;
  score: number; // 0-5
  color: string;
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const requirements = checkPasswordRequirements(password);
  const metCount = requirements.filter((r) => r.met).length;

  if (password.length === 0) {
    return { strength: 'very-weak', label: '', score: 0, color: 'bg-muted' };
  }

  if (metCount <= 1) {
    return { strength: 'very-weak', label: 'Very Weak', score: 1, color: 'bg-red-500' };
  }

  if (metCount === 2) {
    return { strength: 'weak', label: 'Weak', score: 2, color: 'bg-orange-500' };
  }

  if (metCount === 3) {
    return { strength: 'fair', label: 'Fair', score: 3, color: 'bg-yellow-500' };
  }

  if (metCount === 4) {
    return { strength: 'strong', label: 'Strong', score: 4, color: 'bg-lime-500' };
  }

  return { strength: 'very-strong', label: 'Very Strong', score: 5, color: 'bg-green-500' };
}

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
