const BotChart = require("./core/bot-chart/BotChart");
const BotStrategy = require("./core/BotStrategy");

const chart = new BotChart();

(async function () {
  try {
    await chart.getData();

    const strategy = new BotStrategy();

    for (let candlestick of chart.data) {
      strategy.tick({ candlestick });
    }
  } catch (err) {
    console.error(err);
  }
})();
