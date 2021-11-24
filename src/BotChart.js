const KrakenApi = require("./KrakenApi");

const kraken = new KrakenApi();

module.exports = class BotChart {
  constructor(pair = 'ADAUSDT', interval = '60') {
    this.pair = pair;
    this.interval = interval;
    this.data = undefined;
  }

  async getData() {
    try {
      const { data: { result } } = await kraken.getOHLC({
        pair: this.pair,
        interval: this.interval,
      });
      this.data = result[this.pair];
    } catch (err) {
      console.error(err);
    }
  }
};
