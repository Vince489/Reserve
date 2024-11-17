import { Keypair } from "./Keypair.js";
import { PublicKey } from "./PublicKey.js";
import { Transaction } from "./Transaction.js"; // Import the Transaction class
import { TransactionInstruction } from "./TransactionInstruction.js";

class Wallet {
  constructor() {
    this.keypairs = []; // Array to hold all keypairs in the wallet
    this.tokenAccounts = new Map(); // Maps public keys (Base58 strings) to token accounts
  }

  // Creates a new keypair and adds it to the wallet
  createKeypair() {
    const keypair = Keypair.generate();
    this.keypairs.push(keypair);
    return keypair;
  }

  // Adds an existing keypair to the wallet
  addKeypair(keypair) {
    if (!(keypair instanceof Keypair)) {
      throw new Error('Invalid Keypair instance.');
    }

    // Check if the public key already exists in the wallet
    const publicKeyBase58 = keypair.publicKey.toString();
    if (this.keypairs.some(kp => kp.publicKey.toString() === publicKeyBase58)) {
      throw new Error('Keypair already exists in the wallet.');
    }

    this.keypairs.push(keypair);
  }

  // Retrieves a keypair by its public key
  getKeypair(publicKey) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    return this.keypairs.find(kp => kp.publicKey.toString() === publicKeyBase58) || null;
  }

  // Removes a keypair from the wallet
  removeKeypair(publicKey) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    const initialLength = this.keypairs.length;
    this.keypairs = this.keypairs.filter(
      kp => kp.publicKey.toString() !== publicKeyBase58
    );
    return this.keypairs.length < initialLength;
  }

  // Links a token account to a public key
  linkTokenAccount(publicKey, tokenAccount) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    if (!this.keypairs.some(kp => kp.publicKey.toString() === publicKeyBase58)) {
      throw new Error('Public key not found in the wallet.');
    }

    this.tokenAccounts.set(publicKeyBase58, tokenAccount);
  }

  // Lists all keypairs in the wallet
  listKeypairs() {
    return this.keypairs;
  }

  // Lists all token accounts associated with the wallet's keypairs
  listTokenAccounts() {
    if (this.tokenAccounts.size === 0) {
      console.log('No token accounts linked.');
    } else {
      this.tokenAccounts.forEach((account, publicKeyBase58) => {
        console.log(`Token account linked to public key ${publicKeyBase58}:`, account);
      });
    }
  }

  // Creates a new transaction
  createTransaction(sender, recipient) {
    const transaction = new Transaction();
  
    // Populate the transaction with the fee payer (sender), recent blockhash, and block height
    transaction.populate({
      feePayer: sender.publicKey,  // Sender is the fee payer
      recentBlockhash: "someHash", // Replace with actual blockhash from your system
      lastValidBlockHeight: 1000  // Replace with actual block height
    });
  
    // Create a transaction instruction and add it to the transaction
    const instruction = new TransactionInstruction(sender, recipient);
    transaction.add(instruction);
  
    return transaction;
  }
  

  // Signs a transaction with all keypairs in the wallet
  signTransaction(transaction) {
    // Ensure the sender is the fee payer for the transaction
    const senderKeypair = this.getKeypair(transaction.feePayer);
    if (!senderKeypair) {
      throw new Error("Fee payer keypair not found in wallet.");
    }
  
    // Sign the transaction with the sender's keypair
    transaction.sign([senderKeypair]);
  }
  
  

}

export { Wallet };
