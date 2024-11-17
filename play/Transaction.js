import { Keypair } from "./Keypair.js";
import { TransactionInstruction } from "./TransactionInstruction.js";
import { PublicKey } from "./PublicKey.js";

class Transaction {
  constructor() {
    this.instructions = [];
    this.signatures = [];
    this.feePayer = null;
    this.recentBlockhash = null;
    this.lastValidBlockHeight = null;
  }

  add(instruction) {
    if (!(instruction instanceof TransactionInstruction)) {
      throw new Error("Invalid instruction. Must be an instance of TransactionInstruction.");
    }
    this.instructions.push(instruction);
  }

  populate({ feePayer, recentBlockhash, lastValidBlockHeight }) {
    if (!feePayer) throw new Error("feePayer is required.");
    if (!recentBlockhash) throw new Error("recentBlockhash is required.");
    if (!lastValidBlockHeight) throw new Error("lastValidBlockHeight is required.");

    this.feePayer = feePayer;
    this.recentBlockhash = recentBlockhash;
    this.lastValidBlockHeight = lastValidBlockHeight;
}

validate() {
  // Check if transaction has signatures
  if (!this.signatures || this.signatures.length === 0) {
    return false;
  }

  // Check if the transaction has instructions
  if (!this.instructions || this.instructions.length === 0) {
    return false;
  }

  // Check if the fee payer and recent blockhash are present
  if (!this.feePayer || !this.recentBlockhash) {
    return false;
  }

  // You can add more complex checks here as needed

  return true; // If all checks pass, the transaction is valid
}



  verifySignatures() {
    const message = this.compileMessage();
    return this.signatures.every(({ publicKey, signature }) => {
      return Keypair.verify(message, signature, publicKey);
    });
  }

  getEstimatedFee() {
    const baseFee = 100;
    const instructionFee = 10;
    return baseFee + this.instructions.length * instructionFee;
  }

  sign(keypairs) {
    const message = this.compileMessage();
  
    // Ensure keypairs is an array
    if (!Array.isArray(keypairs)) {
      throw new Error("keypairs must be an array.");
    }
  
    // Convert this.feePayer to Base58 if it's not already a string
    const feePayerPublicKeyBase58 = this.feePayer instanceof PublicKey
      ? this.feePayer.toString()
      : this.feePayer; // Assume it's already a Base58 string
  
    // Find the keypair that corresponds to the fee payer
    const feePayerKeypair = keypairs.find(
      keypair => keypair.publicKey.toString() === feePayerPublicKeyBase58
    );
  
    if (!feePayerKeypair) {
      throw new Error("Fee payer keypair not found.");
    }
  
    // Sign the message with the fee payer's keypair
    const signature = feePayerKeypair.sign(message);
    this.signatures = [{ publicKey: feePayerKeypair.publicKey, signature }];
  }
  
  

  compileMessage() {
    return JSON.stringify({
      feePayer: this.feePayer,
      recentBlockhash: this.recentBlockhash,
      instructions: this.instructions,
    });
  }

  static verify(transaction, publicKey) {
    const isValid = Keypair.verify(
      JSON.stringify(transaction.instructions),
      transaction.signatures[0].signature,
      publicKey
    );
    return isValid;
  }

  async saveToDB() {
    const id = this.getTransactionId(); // Assume this method generates a unique ID for the transaction
    await transactionsDB.put(id, this.serialize());
  }

  static async loadFromDB(transactionId) {
    const data = await transactionsDB.get(transactionId);
    return Transaction.fromJSON(data);
  }

  serialize() {
    return JSON.stringify({
      feePayer: this.feePayer,
      recentBlockhash: this.recentBlockhash,
      instructions: this.instructions.map(inst => inst.toJSON()),
      signatures: this.signatures.map(({ publicKey, signature }) => ({
        publicKey: publicKey.toString(),
        signature,
      })),
    });
  }

  static fromJSON(data) {
    const transaction = new Transaction();
    transaction.feePayer = data.feePayer;
    transaction.recentBlockhash = data.recentBlockhash;
    transaction.lastValidBlockHeight = data.lastValidBlockHeight;
    transaction.instructions = data.instructions.map(inst => TransactionInstruction.fromJSON(inst));
    transaction.signatures = data.signatures.map(({ publicKey, signature }) => ({
      publicKey: Keypair.fromPublicKey(publicKey),
      signature,
    }));
    return transaction;
  }
}

export { Transaction };
