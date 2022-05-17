const BotIndicators = require("./bot-indicators/BotIndicators");
const BotLog = require("./BotLog");
const BotTrade = require("./BotTrade");

module.exports = class BotStrategy {
  constructor() {
    this.output = new BotLog();
    this.prices = [];
    this.trades = [];
    this.currentPrice = undefined;
    this.numSimulTrades = 1;
    this.movingAverage = undefined;

    this.indicators = new BotIndicators();
  }

  tick({ candlestick, price }) {
    this.currentPrice = candlestick
      ? (parseFloat(candlestick[2]) + parseFloat(candlestick[3])) / 2 // (high + low) / 2
      : parseFloat(price);
    this.prices.push(this.currentPrice);
    this.movingAverage = this.indicators.movingAverage(this.prices, 15);
    this.output.log(
      "Price: " +
        this.currentPrice.toFixed(16) +
        "\tMoving Average: " +
        this.movingAverage
    );
    this.evaluatePositions();
    this.updateOpenTrades();
    this.showPositions();
  }

  evaluatePositions() {
    const openTrades = [];

    for (let trade of this.trades) {
      if (trade.status === "OPEN") {
        openTrades.push(trade);
      }
    }

    if (openTrades.length < this.numSimulTrades) {
      if (this.currentPrice < this.movingAverage) {
        this.trades.push(new BotTrade(this.currentPrice, 0.4));
      }
    }

    for (let trade of openTrades) {
      if (this.currentPrice > this.movingAverage) {
        trade.close(this.currentPrice);
      }
    }
  }

  updateOpenTrades() {
    for (let trade of this.trades) {
      if (trade.status === "OPEN") {
        trade.tick(this.currentPrice);
      }
    }
  }

  showPositions() {
    for (let trade of this.trades) {
      trade.showTrade();
    }
  }
};
