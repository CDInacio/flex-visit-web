export function formatPhoneNumber(number: string) {
  if (!number) return number;
  const phoneNumber = number.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

  // Formata com o padrão (XX) XXXXX-XXXX
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 3) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7
  )}-${phoneNumber.slice(7, 11)}`;
}