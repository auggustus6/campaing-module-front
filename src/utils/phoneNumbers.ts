export function addBrazilianCountryCode(phoneNumber: string) {
  const number = phoneNumber.replace(/\D/g, '');
  console.log('number', number);

  if (phoneNumber.startsWith('55')) return number;
  
  return `55${number}`;
}
