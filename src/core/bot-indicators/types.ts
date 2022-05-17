import { TKLineData } from "../../api/types";

interface IBotIndicators {
  historicalData: TKLineData;
  pointsForMa?: number;
}

interface CBotIndicators {
  getCurrentMovAverage: () => number;
}

export {
  IBotIndicators,
  CBotIndicators
}