const crypto = require("crypto");
const fs = require("fs");

const syncTimer = (time) => {
  const future = Date.now() + time * 1000;
  while (future - Date.now() > 0) {}
};

const getSignature = (value = "") => {
  //creating hmac object
  const hmac = crypto.createHmac(
    "sha256",
    "ieSaqHR37u7Rfh2qXu9voaSjdZgkb3wcDuTrCdTuJllkYYmdtBkBY1HC3nmKkpxD"
  );
  //passing the data to be hashed
  const data = hmac.update(value);
  //Creating the hmac in the required format
  return data.digest("hex");
};

const formateDate = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

module.exports = {
  syncTimer,
  getSignature,
  formateDate,
};
