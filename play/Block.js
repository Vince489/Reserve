import crypto from 'crypto';
import { Transaction } from './Transaction.js';

class Block {
  constructor(index, timestamp, transactions = [], previousHash = "") {
      this.index = index;
      this.timestamp = timestamp;
      this.transactions = Array.isArray(transactions) ? transactions : []; // Ensure transactions is an array
      this.previousHash = previousHash;
      this.hash = this.calculateHash();  // Call calculateHash to generate the block's hash
  }

  // Method to calculate the block's hash
  calculateHash() {
      const data = this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash;
      return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Method to add a transaction to the block
  addTransaction(transaction) {
    if (!(transaction instanceof Transaction)) {
      throw new Error('Invalid transaction. Must be an instance of Transaction.');
    }
    this.transactions.push(transaction); // Add the transaction to the transactions array
    this.hash = this.calculateHash(); // Recalculate hash after adding a transaction
  }
  

  // Method to check the validity of the block (basic example)
  isValid(previousBlock) {
      if (this.previousHash !== previousBlock.hash) {
          throw new Error('Previous block hash does not match.');
      }
      if (this.hash !== this.calculateHash()) {
          throw new Error('Block hash is invalid.');
      }
      return true;
  }

  // Static method to create the genesis block
  static createGenesisBlock() {
      return new Block(0, Date.now(), [], "0"); // First block in the chain
  }
}

export { Block };



