import events from "events";

import { IAppVars } from "../types/types";
import { TKLineData } from "../api/types";

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
  getPairKLinePromise: undefined,
  canSubmitAnotherRequest: true,
  // to calculate moving average
  counterTillNPoints: 0,
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
