const url = require("url");
const axios = require("axios");

const { getSignature } = require("./helpers");

const BASE_ENDPOINT = "https://api.binance.com";
const SYMBOL_PRICE_TICKER = "/api/v3/ticker/price";
const KLINE = "/api/v3/klines";
const TEST_NEW_ORDER = "/api/v3/order/test";

const getPairPrice = (pair = "XMRBTC") => {
  return axios.get(BASE_ENDPOINT + SYMBOL_PRICE_TICKER + "?symbol=" + pair);
};

const getPairKLine = (
  payload = {
    symbol: "XMRBTC",
    interval: "3m",
    startTime: Date.parse("18 Feb 2021 12:00:00 GMT"),
    endTime: Date.parse("19 Feb 2021 12:00:00 GMT"),
    // limit?: 'int' // default 500; max 1000
  }
) => {
  const params = new url.URLSearchParams(payload);
  return axios.get(BASE_ENDPOINT + KLINE + "?" + params);
};

const testNewOrder = (
  payload = {
    symbol: "XMRBTC",
    side: "SELL",
    type: "LIMIT",
    timeInForce: "GTC",
    quantity: 0.1,
    price: 0.000001,
    timestamp: Date.now() - 1000,
  }
) => {
  const params = new url.URLSearchParams(payload);

  params.append("signature", getSignature(params.toString()));

  console.log(params.toString());

  return axios.post(BASE_ENDPOINT + TEST_NEW_ORDER + "?" + params, null, {
    headers: {
      "X-MBX-APIKEY":
        "jil6MYbTeucd9VZWciqlST06xNmAHbBY9M1veYv6tW3JsFfjBwEZhj8mV13J4OZv",
    },
  });
};

testNewOrder()
  .then(({ data }) => console.log(data))
  .catch((err) => console.log("### ERROR ###", err));

module.exports = {
  getPairPrice,
  getPairKLine,
};
