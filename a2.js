class Account {
  constructor(ownerName, balanceInVinnies = 0, metadata = {}) {
      this.ownerName = ownerName;               // Owner of the account
      this.balanceInVinnies = balanceInVinnies;  // Balance in vinnies
      this.metadata = metadata;                 // Additional metadata (e.g., account status, type, etc.)
  }

  // Helper to convert VRT to vinnies (1 VRT = 100,000,000 vinnies)
  convertVRTtoVinnies(vrtAmount) {
      return vrtAmount * 100000000;
  }

  // Helper to convert vinnies to VRT (1 VRT = 100,000,000 vinnies)
  convertVinniesToVRT(vinniesAmount) {
      return vinniesAmount / 100000000;
  }

  // Method to get the account balance in VRT
  getBalanceInVRT() {
      return this.convertVinniesToVRT(this.balanceInVinnies);
  }

  // Method to get the account balance in Vinnies
  getBalanceInVinnies() {
      return this.balanceInVinnies;
  }

  // Method to deposit an amount into the account (in vinnies)
  deposit(amountInVinnies) {
      if (amountInVinnies <= 0) {
          console.log('Amount must be positive');
          return;
      }
      this.balanceInVinnies += amountInVinnies;
  }

  // Method to withdraw an amount from the account (in vinnies)
  withdraw(amountInVinnies) {
      if (amountInVinnies <= 0 || amountInVinnies > this.balanceInVinnies) {
          console.log('Invalid withdrawal amount');
          return;
      }
      this.balanceInVinnies -= amountInVinnies;
  }

  // Method to update account metadata
  updateMetadata(newMetadata) {
      this.metadata = { ...this.metadata, ...newMetadata };
  }

  // Method to get account details
  getAccountDetails() {
      return {
          ownerName: this.ownerName,
          balanceVRT: this.getBalanceInVRT(),
          balanceVinnies: this.balanceInVinnies,
          metadata: this.metadata,
      };
  }
}
