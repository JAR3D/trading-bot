const BotLog = require("./BotLog");

module.exports = class BotTrade {
  constructor(currentPrice, stopLoss = 0) {
    this.output = new BotLog();
    this.status = "OPEN";
    this.entryPrice = currentPrice;
    this.exitPrice = undefined;
    this.output.log("Trade opened");
    this.stopLoss = stopLoss > 0 ? currentPrice - stopLoss : undefined;
  }

  close(currentPrice) {
    this.status = "CLOSED";
    this.exitPrice = currentPrice;
    this.output.log("Trade closed");
  }

  tick(currentPrice) {
    if (this.stopLoss) {
      if (currentPrice < this.stopLoss) {
        this.close(currentPrice);
      }
    }
  }

  showTrade() {
    const exitPriceToShow = this.exitPrice ? this.exitPrice.toFixed(16) : "";
    let tradeStatus =
      "Entry price: " +
      this.entryPrice.toFixed(16) +
      " Status: " +
      this.status +
      " Exit Price: " +
      exitPriceToShow;

    if (this.status === "CLOSED") {
      tradeStatus += " Profit: " + (this.exitPrice - this.entryPrice);
    }

    this.output.log(tradeStatus);
  }
};
