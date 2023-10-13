export function addBrazilianCountryCode(phoneNumber: string) {
  const number = phoneNumber.replace(/\D/g, '');

  if (phoneNumber.startsWith('55')) return number;

  return `55${number}`;
}

export function formatPhoneNumber(number:string) {
  // Convert the number to a string
  const numberStr = number.toString();
  
  // Initialize variables for parts of the phone number
  let countryCode = "";
  let stateCode = "";
  let areaCode = "";
  let subscriberNumber = "";

  // Extract the parts of the phone number based on their length
  if (numberStr.length >= 2) {
    countryCode = numberStr.substr(0, 2);
  }
  if (numberStr.length >= 4) {
    stateCode = numberStr.substr(2, 2);
  }
  if (numberStr.length >= 9) {
    areaCode = numberStr.substr(4, 5);
  }
  if (numberStr.length >= 13) {
    subscriberNumber = numberStr.substr(9, 4);
  }
  
  // Format the phone number
  const formattedNumber = `+${countryCode} ${stateCode} ${areaCode}-${subscriberNumber}`;
  
  return formattedNumber;
}