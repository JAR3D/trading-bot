import ApexCharts from "apexcharts";

import { TDataPoints, ICreateSeriesItem } from "./types";

export class BotChart {
  private dataPoints;

  constructor(dataPoints: TDataPoints) {
    this.dataPoints = [...dataPoints];
  }

  draw = () => {
    const options = {
      series: [this.createSeriesItem({ name: "candle", type: "candlestick" })],
      chart: { height: 350, type: "line" },
      title: { text: "CandleStick Chart", align: "left" },
      stroke: { width: [3, 1] },
      tooltip: {
        shared: true,
        custom: [
          function ({ seriesIndex, dataPointIndex, w }: any) {
            return w.globals.series[seriesIndex][dataPointIndex];
          },
          function ({ seriesIndex, dataPointIndex, w }: any) {
            var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
            var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
            var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
            var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
            return "";
          },
        ],
      },
      xaxis: {
        type: "datetime",
      },
    };

    const chart = new ApexCharts(
      // @ts-ignore
      document.querySelector("#chart"),
      options
    );

    chart.render().then(() => true);
  };

  // for ApexCharts
  createSeriesItem = ({ name, type }: ICreateSeriesItem) => {
    return {
      name,
      type,
      data: this.createSeriesItemData(this.dataPoints),
    };
  };

  createSeriesItemData = (dataPoints: TDataPoints) => {
    return dataPoints.map((dataPoint) => {
      return {
        x: new Date(dataPoint.date),
        y: dataPoint.candleStick,
      };
    });
  };
}
