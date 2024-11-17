import { Keypair } from './Keypair.js';
import { PublicKey } from './PublicKey.js';
import { Transaction } from './Transaction.js';
import { TransactionInstruction } from './TransactionInstruction.js';

/**
 * Represents a wallet that manages multiple keypairs and integrates with token accounts.
 */
class Wallet {
  /**
   * Creates a new Wallet instance.
   */
  constructor() {
    this.keypairs = []; // Array to hold all keypairs in the wallet
    this.tokenAccounts = new Map(); // Maps public keys (Base58 strings) to token accounts
    this.transactions = []; // Array to store transactions
  }

  /**
   * Generates a new Keypair and adds it to the wallet.
   * @returns {Keypair} The newly created Keypair.
   */
  createKeypair() {
    const keypair = Keypair.generate();
    this.keypairs.push(keypair);
    return keypair;
  }

  /**
   * Adds an existing Keypair to the wallet.
   * @param {Keypair} keypair - The Keypair to add.
   * @throws {Error} If the keypair is invalid or already exists in the wallet.
   */
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

  /**
   * Retrieves a Keypair by its public key.
   * @param {PublicKey|string} publicKey - The public key (PublicKey instance or Base58 string).
   * @returns {Keypair|null} The Keypair with the given public key, or null if not found.
   */
  getKeypair(publicKey) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    return this.keypairs.find(kp => kp.publicKey.toString() === publicKeyBase58) || null;
  }

  /**
   * Removes a Keypair from the wallet.
   * @param {PublicKey|string} publicKey - The public key of the Keypair to remove.
   * @returns {boolean} `true` if the Keypair was removed, `false` if not found.
   */
  removeKeypair(publicKey) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    const initialLength = this.keypairs.length;
    this.keypairs = this.keypairs.filter(
      kp => kp.publicKey.toString() !== publicKeyBase58
    );
    return this.keypairs.length < initialLength;
  }

  /**
   * Links a token account to a public key.
   * @param {PublicKey|string} publicKey - The public key to associate with the token account.
   * @param {Object} tokenAccount - The token account data to link.
   * @throws {Error} If the public key is not found in the wallet.
   */
  linkTokenAccount(publicKey, tokenAccount) {
    const publicKeyBase58 =
      publicKey instanceof PublicKey ? publicKey.toString() : publicKey;

    if (!this.keypairs.some(kp => kp.publicKey.toString() === publicKeyBase58)) {
      throw new Error('Public key not found in the wallet.');
    }

    this.tokenAccounts.set(publicKeyBase58, tokenAccount);
  }

  /**
   * Lists all keypairs in the wallet.
   * @returns {Keypair[]} Array of keypairs in the wallet.
   */
  listKeypairs() {
    return this.keypairs;
  }

  /**
   * Lists all token accounts associated with the wallet's keypairs.
   */
  listTokenAccounts() {
    if (this.tokenAccounts.size === 0) {
      console.log('No token accounts linked.');
    } else {
      this.tokenAccounts.forEach((account, publicKeyBase58) => {
        console.log(`Token account linked to public key ${publicKeyBase58}:`, account);
      });
    }
  }

  /**
   * Creates a transaction with the provided instructions and signs it.
   * @param {TransactionInstruction[]} instructions - The list of instructions to include in the transaction.
   * @param {Keypair} signer - The keypair used to sign the transaction.
   * @returns {Transaction} The signed transaction.
   */
  createTransaction(instructions, signer) {
    if (!(signer instanceof Keypair)) {
      throw new Error('Signer must be an instance of Keypair.');
    }

    const transaction = new Transaction(instructions);
    transaction.sign(signer);
    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Lists all transactions that have been created and signed in the wallet.
   * @returns {Transaction[]} The list of signed transactions.
   */
  listTransactions() {
    return this.transactions;
  }
}

export { Wallet };
