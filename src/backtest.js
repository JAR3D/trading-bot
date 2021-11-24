const BotChart = require("./BotChart");
const BotStrategy = require("./BotStrategy");

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
