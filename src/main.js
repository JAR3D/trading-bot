const events = require("events");
const { Command } = require("commander");

const { syncTimer } = require("./helpers");

const { getPairPrice, getPairKLine } = require("./api");

const emitter = new events.EventEmitter();

let historicalData,
  nextDataPoint,
  lastPairPrice,
  currentValues,
  getPairKLinePromise,
  dataDate,
  previousPrice,
  tradePlaced,
  typeOfTrade;
let interval = "3m"; // 3 minutes
let period = 2;
let pair = "XMRBTC";
let nPoints = 5;
let currentMovingAverage = 0;
let startTime = 0;
let endTime = 0;
const chartIntervals = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
];
const prices = [];

const options = parseArgs();

if (options.help) {
  console.log("main.js -p <period> -i <interval> -c <currency> -n <points>");
  process.exit();
}

if (options.period) {
  period = options.period;
}

if (options.interval) {
  if (chartIntervals.includes(options.interval)) {
    interval = options.interval;
  } else {
    console.log("binance requires intervals ", chartIntervals);
    process.exit(2);
  }
}

if (options.currency) {
  pair = options.currency;
}

if (options.points) {
  nPoints = options.points;
}

if (options.start) {
  startTime = options.start;
}

if (options.end) {
  endTime = options.end;
}

for (let i = 0; i < nPoints; i++) {
  prices.push(0);
}

if (startTime) {
  getPairKLinePromise = getPairKLine({
    symbol: pair,
    interval: interval,
    startTime: startTime,
    endTime: endTime,
  });
  // .then(({ data }) => {
  //   console.log(data);
  //   historicalData = data;
  //   // emitter.emit("timeEvent");
  //   // const mainInterval = setInterval(() => {
  //   //   emitter.emit("timeEvent");
  //   // }, period * 1000);
  // })
  // .catch((err) => {
  //   console.log("### ERROR ###", err);
  // });
}

Promise.all([getPairKLinePromise]).then((data) => {
  historicalData = data[0].data;
  while (true) {
    emitter.emit("timeEvent");

    if (!startTime) {
      syncTimer(2);
    }
  }
});

////////////////////////////////////////////////////////////////
emitter.on("timeEvent", async () => {
  const date = new Date();
  try {
    if (startTime && historicalData) {
      // console.log("### historicalData ###", historicalData);
      nextDataPoint = historicalData.shift();
      // console.log("### nextDataPoint ###", nextDataPoint);
      if (!nextDataPoint) process.exit();
      lastPairPrice = parseFloat(nextDataPoint[4]);
    } else if (startTime && !historicalData) {
      process.exit();
    } else {
      console.log("### waiting for request... ###");
      const { data } = await getPairPrice(pair);
      lastPairPrice = parseFloat(data.price);
    }

    // console.log(data);
    prices.push(lastPairPrice);
    prices.shift();
    currentMovingAverage = prices.reduce((a, b) => a + b, 0) / nPoints;
    previousPrice = prices[prices.length - 2];

    if (!tradePlaced) {
      // console.log(
      //   "### hit ###",
      //   lastPairPrice,
      //   currentMovingAverage,
      //   previousPrice
      // );

      if (
        lastPairPrice > currentMovingAverage &&
        lastPairPrice < previousPrice
      ) {
        console.log("### SELL ORDER ###");
        tradePlaced = true;
        typeOfTrade = "short";
      } else if (
        lastPairPrice < currentMovingAverage &&
        lastPairPrice > previousPrice
      ) {
        console.log("### BUY ORDER ###");
        tradePlaced = true;
        typeOfTrade = "long";
      }
    } else if (typeOfTrade === "short") {
      if (lastPairPrice < currentMovingAverage) {
        console.log("### EXIT TRADE ###");
        tradePlaced = false;
        typeOfTrade = "";
      } else if (typeOfTrade === "long") {
        if (lastPairPrice > currentMovingAverage) {
          console.log("### EXIT TRADE ###");
          tradePlaced = false;
          typeOfTrade = "";
        }
      }
    }

    process.stdout.write(`${date.getDate()}-`);
    process.stdout.write(`${date.getMonth() + 1}-`);
    process.stdout.write(`${date.getFullYear()} `);
    process.stdout.write(
      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
    );
    process.stdout.write(`Period: ${period}s ${pair}: ${lastPairPrice} `);
    process.stdout.write(`MA: ${currentMovingAverage}\n`);
  } catch (err) {
    console.log("### ERROR ###", err);
  }
});
////////////////////////////////////////////////////////////////

function parseArgs() {
  const program = new Command();
  program
    .option("-h, --help", "show help")
    .option("-p, --period <type>", "to input a period")
    .option("-c, --currency <type>", "to input a currency")
    .option("-n, --points <type>", "to input a number of points")
    .option("-i, --interval <type>", "to input a interval")
    .option("-s, --start <type>", "to input a start time")
    .option("-e, --end <type>", "to input a end time")
    .parse(process.argv);

  return program.opts();
}
