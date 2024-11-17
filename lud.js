class LuhnValidator {
  // Method to calculate the Luhn check digit
  static calculateCheckDigit(cardNumber) {
      let sum = 0;
      let shouldDouble = false;

      // Loop through the digits from right to left
      for (let i = cardNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cardNumber[i]);

          // Double every second digit, starting from the right
          if (shouldDouble) {
              digit *= 2;
              if (digit > 9) {
                  digit -= 9; // Subtract 9 from numbers greater than 9
              }
          }

          sum += digit;
          shouldDouble = !shouldDouble;
      }

      // The check digit is the number that, when added to the sum, makes it a multiple of 10
      return (10 - (sum % 10)) % 10;
  }

  // Method to validate a card number using the Luhn algorithm
  static validate(cardNumber) {
      const checkDigit = cardNumber[cardNumber.length - 1];
      const cardNumberWithoutCheckDigit = cardNumber.slice(0, -1);
      const calculatedCheckDigit = LuhnValidator.calculateCheckDigit(cardNumberWithoutCheckDigit);

      return checkDigit == calculatedCheckDigit;
  }
}

export { LuhnValidator };