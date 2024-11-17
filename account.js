// account.js
import { Transaction } from './transaction.js';

export class Account {
    constructor(ownerName, balanceInVinnies = 0, metadata = {}) {
        this.ownerName = ownerName;
        this.balanceInVinnies = balanceInVinnies;
        this.metadata = metadata;
        this.transactions = []; // Store all transactions
    }

    // Convert VRT to vinnies
    convertVRTtoVinnies(vrtAmount) {
        return vrtAmount * 100000000;
    }

    // Convert vinnies to VRT
    convertVinniesToVRT(vinniesAmount) {
        return vinniesAmount / 100000000;
    }

    // Get balance in VRT for frontend
    getBalanceInVRT() {
        return this.convertVinniesToVRT(this.balanceInVinnies);
    }

    // Record a transaction
    recordTransaction(type, amountInVRT, metadata = {}) {
        const transaction = new Transaction(type, amountInVRT, this.balanceInVinnies, metadata);
        this.transactions.push(transaction);
        return transaction;
    }

    // Deposit money into the account (in VRT)
    deposit(amountInVRT) {
        if (amountInVRT <= 0) {
            console.log('Amount must be positive');
            return;
        }
        const amountInVinnies = this.convertVRTtoVinnies(amountInVRT);
        this.balanceInVinnies += amountInVinnies;
        this.recordTransaction('deposit', amountInVRT);
    }

    // Withdraw money from the account (in VRT)
    withdraw(amountInVRT) {
        if (amountInVRT <= 0) {
            console.log('Amount must be positive');
            return;
        }
        const amountInVinnies = this.convertVRTtoVinnies(amountInVRT);
        if (amountInVinnies > this.balanceInVinnies) {
            console.log('Insufficient balance');
            return;
        }
        this.balanceInVinnies -= amountInVinnies;
        this.recordTransaction('withdraw', amountInVRT);
    }

    // Get account details
    getAccountDetails() {
        return {
            ownerName: this.ownerName,
            balanceVRT: this.getBalanceInVRT(),
            balanceVinnies: this.balanceInVinnies,
            metadata: this.metadata,
            transactions: this.transactions.map(tx => tx.getTransactionDetails()), // Include all transaction details
        };
    }
}
