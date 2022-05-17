type TCandleStick = [open: number, high: number, low: number, close: number];

type TDataPoints = Array<{
  date: number,
  candleStick: TCandleStick
}>;

type TDataChartPoints = Array<{x: Date, y: TCandleStick}>;

interface ICreateSeriesItem {
  name: string;
  type: string;
}

export {
  TDataPoints,
  ICreateSeriesItem,
  TCandleStick,
  TDataChartPoints
}