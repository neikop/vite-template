export const isValidEmail = (email: string | undefined) => {
  if (!email) return false
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}

export const isValidPhone = (phone: string) => {
  return /^\+?[0-9]{10,11}$/.test(phone)
}
