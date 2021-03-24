const events = require("events");
const { Command } = require("commander");

const { getPairPrice, getPairKLine } = require("./api");

const emitter = new events.EventEmitter();

let historicalData;
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
  getPairKLine({
    symbol: pair,
    interval: interval,
    startTime: startTime,
    endTime: endTime,
  })
    .then(({ data }) => {
      console.log(data);
      emitter.emit("timeEvent");
      const mainInterval = setInterval(() => {
        emitter.emit("timeEvent");
      }, period * 1000);
    })
    .catch((err) => {});
}

////////////////////////////////////////////////////////////////
emitter.on("timeEvent", async () => {
  const date = new Date();

  try {
    const { data } = await getPairPrice(pair);

    // console.log(data);
    prices.push(parseFloat(data.price));
    prices.shift();
    currentMovingAverage = prices.reduce((a, b) => a + b, 0) / nPoints;

    process.stdout.write(`\n${date.getDate()}-`);
    process.stdout.write(`${date.getMonth() + 1}-`);
    process.stdout.write(`${date.getFullYear()} `);
    process.stdout.write(
      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
    );
    process.stdout.write(`Period: ${period}s ${data.symbol}: ${data.price} `);
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
