"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appVars = void 0;
const events_1 = __importDefault(require("events"));
let tr;
exports.appVars = {
    options: undefined,
    emitter: new events_1.default.EventEmitter(),
    pricesForMovingAverage: undefined,
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
    historicalData: undefined,
    // to calculate moving average
    counterTillNPoints: 0,
    nextDataPoint: undefined,
    lastPairPrice: undefined,
    dataDate: undefined,
    dataPoints: [],
    numberOfSimilarLocalMaxes: undefined,
    resistanceLine: undefined,
    localMaxArray: [],
    currentMovingAverage: undefined,
    previousPrice: undefined,
    typeOfTrade: undefined,
    tradePlaced: false,
    firstIndexResistanceLine: undefined,
    thresholdSimilarLocalMaxes: undefined
};
