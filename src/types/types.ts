import * as events from "events";
import { OptionValues } from 'commander';

import { RGetPairKLine, TKLineData, TDataItem } from "../api/types";
import { TDataPoints } from "../core/bot-chart/types";

interface ISyncTimer {
  time: number;
}

interface IGetSignature {
  value: string;
}

interface IFormatDate {
  date: Date;
}

interface IAppVars {
  options: OptionValues;
  emitter: events.EventEmitter;
  pricesForMovingAverage: number[];
  chartIntervals: string[];
  getPairKLinePromise?: Promise<RGetPairKLine>;
  canSubmitAnotherRequest: boolean;
  historicalData?: TKLineData;
  // to calculate moving average
  counterTillNPoints: number;
  nextDataPoint?: TDataItem;
  lastPairPrice?: number;
  dataPoints?: TDataPoints;
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

enum EOptions {
  Currency = 'currency',
  EndTime = 'endTime',
  Help = 'help',
  Interval = 'interval',
  Period = 'period',
  Points = 'points',
  StartTime = 'startTime',
}

interface IValidateOptions {
  options: {
    currency: EOptions.Currency,
    endTime: EOptions.EndTime,
    help: EOptions.Help,
    interval: EOptions.Interval,
    period: EOptions.Period,
    points: EOptions.Points,
    startTime: EOptions.StartTime
  };
  appVars: IAppVars;
}

export {
  ISyncTimer,
  IGetSignature,
  IFormatDate,
  IAppVars,
  EOptions,
  IValidateOptions,
  TDataItem
}
