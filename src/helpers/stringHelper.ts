
export const validateEmail = (email: string): boolean => {
  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export const validatePassword = (password: string): boolean => {
  // Password must contain at least one letter, at least one number, and be longer than 8 characters
  const passwordRegex = /^.{8,}$/;
  return passwordRegex.test(password);
}
