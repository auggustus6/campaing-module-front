export function addBrazilianCountryCode(phoneNumber: string) {
  const number = phoneNumber.replace(/\D/g, '');

  if (phoneNumber.startsWith('55')) return number;

  return `55${number}`;
}
