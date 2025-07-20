import * as z from "zod"

// List of known disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com', '10minutemail.net', 'mailinator.com', 'guerrillamail.com',
  'tempmail.org', 'temp-mail.org', 'throwaway.email', 'sharklasers.com',
  'yopmail.com', 'maildrop.cc', 'spam4.me', 'dispostable.com',
  'tempmail.net', 'emailondeck.com', 'mohmal.com', 'nada.email',
  'temp-inbox.com', 'dropmail.me', '33mail.com', 'anonbox.net',
  'burnermail.io', 'guerrillamail.org', 'guerrillamail.net', 'guerrillamail.biz',
  'guerrillamail.de', 'grr.la', 'guerrillamailblock.com', 'pokemail.net',
  'spam.la', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu',
  'trbvm.com', 'inboxkitten.com', 'tempmailo.com', '1secmail.com',
  '1secmail.org', '1secmail.net', 'wwjmp.com', 'esiix.com',
  'xojxe.com', 'yoggm.com', 'qxzrz.com'
]

// Enhanced password validation
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
  .regex(/^[^\s]*$/, "Password cannot contain spaces")

// Enhanced username validation
const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must not exceed 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
  .regex(/^[a-zA-Z0-9]/, "Username must start with a letter or number")
  .regex(/[a-zA-Z0-9]$/, "Username must end with a letter or number")

// Enhanced email validation with temp email detection
const emailValidation = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email is too short")
  .max(255, "Email is too long")
  .refine((email) => {
    const domain = email.split('@')[1]?.toLowerCase()
    return !DISPOSABLE_EMAIL_DOMAINS.includes(domain)
  }, "Temporary or disposable email addresses are not allowed. Please use a permanent email address.")
  .refine((email) => {
    // Additional validation for common patterns
    const localPart = email.split('@')[0]
    return localPart.length >= 1 && localPart.length <= 64
  }, "Invalid email format")

// Enhanced name validation
const nameValidation = z
  .string()
  .min(2, "Full name must be at least 2 characters long")
  .max(100, "Full name must not exceed 100 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, apostrophes, and hyphens")
  .refine((name) => name.trim().length >= 2, "Full name cannot be just whitespace")

export const signInSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z.object({
  name: nameValidation,
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
  email: emailValidation,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordValidation,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// Helper functions for validation
export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase()
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain)
}

export const validatePasswordStrength = (password: string) => {
  const checks = {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
    noSpaces: !/\s/.test(password)
  }
  
  const strength = Object.values(checks).filter(Boolean).length
  return {
    ...checks,
    strength,
    isValid: strength === 6
  }
}