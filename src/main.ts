import BotIndicators from "./core/bot-indicators";
import { getPairPrice, getPairKLine } from "./api";

import { syncTimer } from "./helpers/helpers";
import { parseArgs, validateOptions } from './utils';

import { appVars } from "./vars/vars";
import { IValidateOptions, TDataItem } from "./types/types";

let {
  options,
  emitter,
  getPairKLinePromise,
  canSubmitAnotherRequest,
  historicalData = [],
  nextDataPoint,
  lastPairPrice,
  currentMovingAverage,
  dataPoints = []
} = appVars;

options = parseArgs();

validateOptions({ options, appVars } as IValidateOptions);

// getPairKLinePromise
if (options.limit) {
  getPairKLinePromise = getPairKLine({
    pair: options.pair,
    interval: options.interval,
    limit: options.limit,
  });
}

// test purposes
if (!getPairKLinePromise) process.exit(2);

// wait for getPairKLinePromise then start emitting
let botIndicators: BotIndicators;
getPairKLinePromise.then(({ data }) => {
  historicalData = data;
  botIndicators = new BotIndicators({historicalData, pointsForMa: options.pointsForMa});
  while (true) {
    if (canSubmitAnotherRequest) emitter.emit("timeEvent");

    if (!options.limit) {
      syncTimer({ time: 2 });
    }
  }
});

// emitter
emitter.on("timeEvent", async () => {
  // this is to function with full candlesticks
  nextDataPoint = botIndicators.nextTick();

  // canSubmitAnotherRequest = false;

  const dateNow = new Date();

  try {
    let date = undefined;
    if (options.limit && historicalData && historicalData.length > 0) {
      lastPairPrice = parseFloat(nextDataPoint[4]); // close price
      date = new Date(nextDataPoint[0]); // open time
    } else if (options.limit && historicalData && historicalData.length === 0) {
      process.exit();
    } else {
      console.log("### waiting for request... ###");
      const { data, error } = await getPairPrice(options.pair);
      lastPairPrice = parseFloat(data.price);
    }

    // canSubmitAnotherRequest = true;

    /*
    Calculate the moving average
     */
    currentMovingAverage = botIndicators.getCurrentMovAverage()

    // if date exists we are back testing
    if (date) {
      // for chart purposes
      dataPoints.push({
        date: date.getTime(),
        candleStick: [
          parseFloat(nextDataPoint[1]),
          parseFloat(nextDataPoint[2]),
          parseFloat(nextDataPoint[3]),
          parseFloat(nextDataPoint[4]),
        ],
      });
    }

    process.stdout.write(`${dateNow.getDate()}-`);
    process.stdout.write(`${dateNow.getMonth() + 1}-`);
    process.stdout.write(`${dateNow.getFullYear()} `);
    process.stdout.write(
      `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()} `
    );
    process.stdout.write(`MA: ${currentMovingAverage}\n`);
  } catch (err) {
    console.log("### ERROR ###", err);
  }
});
