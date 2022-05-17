import { TDataItem, TKLineData } from "../../api/types";
import { TDataPoints } from "../bot-chart/types";

interface IBotIndicators {
  historicalData: TKLineData;
  pointsForMa?: number;
}

interface CBotIndicators {
  getCurrentMovAverage: () => number;
  stillExistsHistoricalData: () => boolean;
  saveData: (dataPoints: TDataPoints) => void;
}

export {
  IBotIndicators,
  CBotIndicators
}