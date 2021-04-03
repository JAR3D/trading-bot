const crypto = require("crypto");

const syncTimer = (time) => {
  const future = Date.now() + time * 1000;
  while (future - Date.now() > 0) {}
};

const getSignature = (value = "") => {
  //creating hmac object
  const hmac = crypto.createHmac(
    "sha256",
    "PlH12zutrtC87WXvcg9XhFlbdV9g9h7cCUC6RfdE4t7wFl5fg2cJBgDyyiS7IX2c"
  );
  //passing the data to be hashed
  const data = hmac.update(value);
  //Creating the hmac in the required format
  return data.digest("hex");
};

module.exports = {
  syncTimer,
  getSignature,
};
