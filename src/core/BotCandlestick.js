const BotLog = require("./BotLog");

module.exports = class BotCandlestick {
  constructor(period = 5) { // 5 minutes
    this.current = undefined;
    this.open = undefined;
    this.close = undefined;
    this.high = undefined;
    this.low = undefined;
    this.startTime = Date.now();
    this.period = period;
    this.output = new BotLog();
    this.priceAverage = undefined;
  }

  tick(price) {

  }
}
