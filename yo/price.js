const price = 1775.4352
const formattedPrice = new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD' 
}).format(price)

console.log(`The price of the token is ${formattedPrice}`) // The price of the token is $1,775.97