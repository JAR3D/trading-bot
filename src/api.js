const url = require("url");
const axios = require("axios");

const BASE_ENDPOINT = "https://api.binance.com";
const SYMBOL_PRICE_TICKER = "/api/v3/ticker/price";
const KLINE = "/api/v3/klines";

const getPairPrice = (pair = "XMRBTC") => {
  return axios.get(BASE_ENDPOINT + SYMBOL_PRICE_TICKER + "?symbol=" + pair);
};

const getPairKLine = (
  payload = {
    symbol: "XMRBTC",
    interval: "3m",
    startTime: Date.parse("01 Apr 2021 12:00:00 GMT"), // 1617278400000
    endTime: Date.parse("02 Apr 2021 12:00:00 GMT"), // 1617364800000
    // limit?: 'int' // default 500; max 1000
  }
) => {
  const params = new url.URLSearchParams(payload);
  return axios.get(BASE_ENDPOINT + KLINE + "?" + params);
};

module.exports = {
  getPairPrice,
  getPairKLine,
};
