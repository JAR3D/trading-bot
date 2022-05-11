"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formateDate = exports.getSignature = exports.syncTimer = void 0;
const crypto_1 = __importDefault(require("crypto"));
const syncTimer = ({ time }) => {
    const future = Date.now() + time * 1000;
    while (future - Date.now() > 0) { }
};
exports.syncTimer = syncTimer;
const getSignature = ({ value }) => {
    //creating hmac object
    const hmac = crypto_1.default.createHmac("sha256", "ieSaqHR37u7Rfh2qXu9voaSjdZgkb3wcDuTrCdTuJllkYYmdtBkBY1HC3nmKkpxD");
    //passing the data to be hashed
    const data = hmac.update(value);
    //Creating the hmac in the required format
    return data.digest("hex");
};
exports.getSignature = getSignature;
const formateDate = ({ date }) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
exports.formateDate = formateDate;
