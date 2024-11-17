// Blockchain.js
import { Block } from './Block.js';  // Ensure the path is correct
import { Level } from 'level';

class Blockchain {
  constructor(dbName) {
    // Open the database
    this.db = new Level(dbName, { valueEncoding: 'json' });
    this.chain = [];
    this.loadChain();  // Load existing blockchain from the DB
  }

  // Load existing blockchain from the LevelDB database
  async loadChain() {
    try {
      const chainData = await this.db.get('chain');
      this.chain = chainData || [];
    } catch (err) {
      console.log("No existing chain found, starting with an empty blockchain.");
      this.chain = [];
    }
  }    

  // Add a new block to the chain
  async addBlock(block) {
    this.chain.push(block);
    await this.db.put('chain', this.chain);  // Persist the chain to DB
  }
  
  // Check if the blockchain is valid (simple example of hash check)
  isChainValid() {
    // Basic check: hash of the previous block should match
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getAllBlocks() {
        return this.chain;
    }
}

export { Blockchain };
