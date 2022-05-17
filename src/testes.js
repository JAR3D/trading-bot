//Name of the file : sha256-hmac.js
//Loading the crypto module in node.js
var crypto = require("crypto");
//creating hmac object
var hmac = crypto.createHmac(
  "sha256",
  "PlH12zutrtC87WXvcg9XhFlbdV9g9h7cCUC6RfdE4t7wFl5fg2cJBgDyyiS7IX2c"
);
//passing the data to be hashed
data = hmac.update(
  "symbol=XMRBTC&side=SELL&type=LIMIT&timeInForce=GTC&quantity=0.001&price=0.000001&timestamp=16787878"
);
//Creating the hmac in the required format
gen_hmac = data.digest("hex");
//Printing the output on the console
console.log("hmac : " + gen_hmac);
