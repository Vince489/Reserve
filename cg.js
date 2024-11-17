import { LuhnValidator } from './lud.js';

class CardGenerator {
  constructor() {
      // Define categories and their corresponding digits
      this.categories = {
          "TBD1": 1,
          "Virtron": 2,
          "TBD3": 5,
          "TBD4": 6,
          "Metaverse": 7,
          "Social Media": 8,
          "Community": 9
      };
  }

  // Method to generate a club card number based on category name, tribe code, access level, and apply Luhn algorithm
  generateCard(categoryName, tribeCode, accessLevel) {
      // Check if the category name exists in the categories object
      if (!this.categories[categoryName]) {
          throw new Error("Invalid category name.");
      }

      // Check if the tribe code is valid (must be a 3-digit number)
      if (!/^\d{3}$/.test(tribeCode)) {
          throw new Error("Tribe code must be exactly 3 digits.");
      }

      // Check if the access level is valid (must be 3, 2, 1, or 0)
      if (![0, 1, 2, 3].includes(accessLevel)) {
          throw new Error("Access level must be 3, 2, 1, or 0.");
      }

      // Get the category number based on the name
      const categoryNumber = this.categories[categoryName];

      // Generate the 6-digit account number (random)
      const accountNumber = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');

      // Generate the access level (3, 2, 1, or 0)
      const accessDigit = accessLevel;

      // Generate the remaining 8 random digits
      const randomDigits = Math.floor(Math.random() * 1e8).toString().padStart(8, '0');

      // Combine all parts of the card number (excluding the check digit for now)
      const cardWithoutCheckDigit = `0${categoryNumber}${tribeCode}${accountNumber}${accessDigit}${randomDigits}`;

      // Calculate the check digit using the Luhn algorithm
      const checkDigit = LuhnValidator.calculateCheckDigit(cardWithoutCheckDigit);

      // Combine the full card number with the check digit
      const fullCardNumber = `${cardWithoutCheckDigit}${checkDigit}`;

      return fullCardNumber;
  }
}

export { CardGenerator };