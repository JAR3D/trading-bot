"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appVars = void 0;
const events_1 = __importDefault(require("events"));
exports.appVars = {
    options: {},
    emitter: new events_1.default.EventEmitter(),
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
