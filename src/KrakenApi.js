import url from "url";
import axios from "axios";

export class Kraken {
  constructor() {
    this.baseEndPoint = "https://api.kraken.com";
    this.ohlcUri = "/0/public/OHLC";
    this.tickerUri = "/0/public/Ticker"
  }

  getOHLC(
    payload = {
      pair: "ADAUSDT",
      interval: '1',
    }
  ) {
    const params = new url.URLSearchParams(payload);
    return axios.get(this.baseEndPoint + this.ohlcUri + "?" + params);
  }

  getTick(payload = { pair: 'ADAUSDT' }) {
    const params = new url.URLSearchParams(payload);
    return axios.get(this.baseEndPoint + this.tickerUri + "?" + params);
  }

  async getCurrentAskPrice(payload = { pair: 'ADAUSDT' }) {
    try {
      const { data: { result }} = await this.getTick(payload);
      return result[payload.pair]['a'][0];
    } catch (err) {
      console.error(err);
    }
  }
};
