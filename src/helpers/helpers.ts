import crypto from "crypto";

import { ISyncTimer, IGetSignature, IFormatDate, IValidateOptions } from '../types/types';

const syncTimer = ({ time }: ISyncTimer): void => {
  const future = Date.now() + time * 1000;
  while (future - Date.now() > 0) {}
};

const getSignature = ({ value }: IGetSignature) => {
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

const formateDate = ({ date }: IFormatDate) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};



export {
  syncTimer,
  getSignature,
  formateDate,
};
