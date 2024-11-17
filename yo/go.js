class Token {
  constructor({ 
    name, 
    mint, 
    uri, 
    symbol, 
    mintAuthority, 
    freezeAuthority, 
    totalSupply = 0, 
    type = 'Gaming', 
    decimals = 4, 
    price = null, 
    protocol = 'VRC-20' 
  }) {
    if (!name || !mint || !uri || !symbol || !mintAuthority || !freezeAuthority) {
      throw new Error('Required fields are missing');
    }
    
    this.name = name;
    this.mint = mint;
    this.uri = uri;
    this.symbol = symbol;
    this.mintAuthority = mintAuthority;
    this.freezeAuthority = freezeAuthority;
    this.totalSupply = totalSupply;
    this.type = type;
    this.decimals = decimals;
    this.price = price;
    this.protocol = protocol;
    this.balance = totalSupply; // Initial balance is set to totalSupply
  }

  // Mint new tokens (increase the total supply)
  mintTokens(amount) {
    if (amount <= 0) {
      throw new Error('Amount to mint should be greater than zero');
    }
    this.totalSupply += amount;
    this.balance += amount; // Increase user's balance too
    console.log(`${amount} tokens minted. Total supply is now ${this.totalSupply}`);
  }

  // Freeze tokens (simulate the action by freezing the balance)
  freezeTokens(amount) {
    if (amount <= 0 || amount > this.balance) {
      throw new Error('Invalid amount to freeze');
    }
    this.balance -= amount;
    console.log(`${amount} tokens frozen. Balance is now ${this.balance}`);
  }

  // Unfreeze tokens (restore frozen tokens back to the balance)
  unfreezeTokens(amount) {
    if (amount <= 0) {
      throw new Error('Amount to unfreeze should be greater than zero');
    }
    this.balance += amount;
    console.log(`${amount} tokens unfrozen. Balance is now ${this.balance}`);
  }

  // Transfer tokens between accounts
  transfer(amount, recipientToken) {
    if (this.balance < amount) {
      throw new Error('Insufficient balance to transfer');
    }
    this.balance -= amount;
    recipientToken.balance += amount;
    console.log(`${amount} tokens transferred to ${recipientToken.name}. New balance: ${this.balance}`);
  }

  // Update the price of the token
  updatePrice(newPrice) {
    this.price = newPrice;
    console.log(`The price of ${this.name} token has been updated to ${this.price}`);
  }

  // Get the current status of the token
  getStatus() {
    return {
      name: this.name,
      mint: this.mint,
      uri: this.uri,
      symbol: this.symbol,
      mintAuthority: this.mintAuthority,
      freezeAuthority: this.freezeAuthority,
      totalSupply: this.totalSupply,
      type: this.type,
      decimals: this.decimals,
      price: this.price,
      protocol: this.protocol,
      balance: this.balance,
    };
  }
}

// Example usage:

// Create a new token
const gamingToken = new Token({
  name: 'GamingCoin',
  mint: 'mint123',
  uri: 'http://gamingcoin.com/uri',
  symbol: 'GCOIN',
  mintAuthority: 'mintAuth123',
  freezeAuthority: 'freezeAuth123',
  totalSupply: 1000000,
});

// Mint new tokens
gamingToken.mintTokens(50000);

// Freeze some tokens
gamingToken.freezeTokens(20000);

// Transfer tokens between two instances of Token
const rewardToken = new Token({
  name: 'RewardToken',
  mint: 'mint456',
  uri: 'http://rewardtoken.com/uri',
  symbol: 'REWARD',
  mintAuthority: 'mintAuth456',
  freezeAuthority: 'freezeAuth456',
  totalSupply: 500000,
});

gamingToken.transfer(1000, rewardToken);

// Update the price
gamingToken.updatePrice(10.5);

// Get token status
console.log(gamingToken.getStatus());
