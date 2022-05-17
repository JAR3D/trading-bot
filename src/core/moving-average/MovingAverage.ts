import { TKLineData } from "../../api/types";
import { IMovingAverage } from "./types";

export class MovingAverage implements IMovingAverage{
  private pointsForMa = -1;

  constructor(pointsForMa: number) {
    this.pointsForMa = pointsForMa;
  }

  sma = (historicalData: TKLineData): number => {
    const tecData = historicalData.slice(
      historicalData.length - this.pointsForMa
    );

    return (
      tecData.reduce((acc, curr) => acc + parseFloat(curr[4]), 0) /
      tecData.length
    );
  };
}
