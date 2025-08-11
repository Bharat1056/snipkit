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
