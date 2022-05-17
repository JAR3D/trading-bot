import { TKLineData } from "../../api/types";

interface IMovingAverage {
  sma: (historicalData: TKLineData) => number;
}

export {
  IMovingAverage
}