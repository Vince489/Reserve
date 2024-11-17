// main.js
import { CardGenerator } from './cg.js';
import { Account } from './account.js';

class Card {
    constructor(categoryName, tribeCode, accessLevel, ownerName) {
        this.cardGenerator = new CardGenerator();
        this.cardNumber = this.cardGenerator.generateCard(categoryName, tribeCode, accessLevel);
        this.expirationDate = this.generateExpirationDate();
        this.cvv = this.generateCVV();

        // Create an Account object linked to this card
        this.account = new Account(ownerName);
    }

    // Generate expiration date (MM/YY)
    generateExpirationDate() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 1-based month
        const expirationYear = currentYear + 2;
        const expirationMonth = currentMonth + 1;
        return `${String(expirationMonth).padStart(2, '0')}/${String(expirationYear).slice(2)}`;
    }

    // Generate 3-digit CVV
    generateCVV() {
        return Math.floor(Math.random() * 900) + 100;
    }

    // Get all card details (card number, expiration, CVV, and account details)
    getCardDetails() {
        return {
            cardNumber: this.cardNumber,
            expirationDate: this.expirationDate,
            cvv: this.cvv,
            account: this.account.getAccountDetails(),
        };
    }
}

// Example usage
const card = new Card("Virtron", "078", 3, "John Doe");
console.log(card.getCardDetails());

// Depositing into account
card.account.deposit(1000);
console.log(card.getCardDetails());
