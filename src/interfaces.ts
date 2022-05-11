import events from "events";
import { OptionValues } from 'commander';

interface ISyncTimer {
  time: number;
}

interface IGetSignature {
  value: string;
}

interface IFormatDate {
  date: Date;
}

interface IGetPairPrice {
  value: string
}

interface IGetPairKLine {
  symbol: string,
  interval: string,
  startTime: string,
  endTime: string,
}

interface IAppVars {
  options: OptionValues;
  emitter: events.EventEmitter;
  pricesForMovingAverage: number[];
  chartIntervals: string[];
  getPairKLinePromise: Promise<{ data: any }>;
  canSubmitAnotherRequest: boolean;
  historicalData: Array<any[]>;
  // to calculate moving average
  counterTillNPoints: number;
  nextDataPoint: any[];
  lastPairPrice: number;
  dataDate: Date;
  dataPoints: Array<{
    date: number,
    price: number,
    trend: number,
    label: string,
    desc: string
  }>;
  numberOfSimilarLocalMaxes: number;
  resistanceLine: number;
  localMaxArray: { [key: string]: any }[];
  currentMovingAverage: number;
  previousPrice: number;
  typeOfTrade: string;
  tradePlaced: boolean;
  firstIndexResistanceLine: undefined;
  thresholdSimilarLocalMaxes: undefined;
}

export {
  ISyncTimer,
  IGetSignature,
  IFormatDate,
  IGetPairPrice,
  IGetPairKLine,
  IAppVars
}
