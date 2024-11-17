// transaction.js
export class Transaction {
  constructor(type, amountInVRT, accountBalanceBefore, metadata = {}) {
      this.transactionId = this.generateTransactionId();
      this.type = type; // 'deposit', 'withdraw', etc.
      this.amountInVRT = amountInVRT; // Store transaction amount in VRT for readability
      this.amountInVinnies = this.convertVRTtoVinnies(amountInVRT); // Backend precision
      this.timestamp = new Date().toISOString();
      this.accountBalanceBefore = accountBalanceBefore;
      this.accountBalanceAfter = accountBalanceBefore + (type === 'deposit' ? this.amountInVinnies : -this.amountInVinnies);
      this.metadata = metadata;
  }

  // Generate a unique transaction ID
  generateTransactionId() {
      return `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  // Convert VRT to vinnies
  convertVRTtoVinnies(vrtAmount) {
      return vrtAmount * 100000000;
  }

  // Get transaction details
  getTransactionDetails() {
      return {
          transactionId: this.transactionId,
          type: this.type,
          amountInVRT: this.amountInVRT,
          timestamp: this.timestamp,
          accountBalanceBefore: this.accountBalanceBefore,
          accountBalanceAfter: this.accountBalanceAfter,
          metadata: this.metadata,
      };
  }
}
