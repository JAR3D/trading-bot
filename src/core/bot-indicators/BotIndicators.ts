import fs from 'fs';
import path from 'path';

import { MovingAverage } from "../moving-average/MovingAverage";

import { TDataPoints } from "../bot-chart/types";
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

    this.historicalData = historicalData;
  }

  getCurrentMovAverage = () => {
    return this.movingAverage.sma(this.calcHistoricalData);
  };

  nextTick = () => {
    const nextDataPoint = this.historicalData.shift() as TDataItem;
    this.calcHistoricalData.push(nextDataPoint);
    return { ...nextDataPoint };
  };

  stillExistsHistoricalData = () => this.historicalData.length > 0;

  saveData = (dataPoints: TDataPoints) => {
    const dir = path.join(__dirname, '../../../', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    try {
      fs.writeFileSync(dir + '/data.json', JSON.stringify(dataPoints, null, 2));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
