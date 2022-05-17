import { MovingAverage } from "../moving-average/MovingAverage";

import { IBotIndicators, CBotIndicators } from "./types";
import { IMovingAverage } from "../moving-average/types";
import { TDataItem } from "../../api/types";

export class BotIndicators implements CBotIndicators {
  private movingAverage;
  private historicalData;
  private calcHistoricalData = [] as TDataItem[];

  constructor({ historicalData, pointsForMa }: IBotIndicators) {
    this.movingAverage = (pointsForMa &&
      new MovingAverage(pointsForMa)) as IMovingAverage;

    this.historicalData = [...historicalData];
  }

  getCurrentMovAverage = () => {
    return this.movingAverage.sma(this.calcHistoricalData);
  };

  nextTick = () => {
    const nextDataPoint = this.historicalData.shift() as TDataItem;
    this.calcHistoricalData.push(nextDataPoint);
    return nextDataPoint;
  };
}
