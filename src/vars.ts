import events from "events";

import { IAppVars } from "./interfaces";

export const appVars: IAppVars = {
  options: {},
  emitter: new events.EventEmitter(),
  pricesForMovingAverage: [],
  chartIntervals: [
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
  ],
  getPairKLinePromise: Promise.resolve({ data: undefined }),
  canSubmitAnotherRequest: true,
  historicalData: [],
  // to calculate moving average
  counterTillNPoints: 0,
  nextDataPoint: [],
  lastPairPrice: -1,
  dataDate: new Date(),
  dataPoints: [],
  numberOfSimilarLocalMaxes: -1,
  resistanceLine: -1,
  localMaxArray: [],
  currentMovingAverage: -1,
  previousPrice: -1,
  typeOfTrade: '',
  tradePlaced: false,
  firstIndexResistanceLine: undefined,
  thresholdSimilarLocalMaxes: undefined,
};
