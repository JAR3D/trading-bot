const events = require("events");

module.exports.appVars = {
  options: undefined,
  emitter: new events.EventEmitter(),
  pricesForMovingAverage: undefined,
  chartIntervals: [
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "8h",
    "12h",
    "1d",
    "3d",
    "1w",
    "1M",
  ],
  getPairKLinePromise: undefined,
  googleChart: `
    <html>
      <head>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
          google.charts.load("current", {"packages":["corechart"]});
          google.charts.setOnLoadCallback(drawChart);
          function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn("date", "time");
            data.addColumn("number", "value");
            data.addColumn({type: "string", role:"annotation"});
            data.addColumn({type: "string", role:"annotationText"});
            data.addColumn("number", "trend");
            data.addRows([
  `,
  canSubmitAnotherRequest: true,
  historicalData: undefined,
  // to calculate moving average
  counterTillNPoints: 0,
  nextDataPoint: undefined,
  lastPairPrice: undefined,
  dataDate: undefined,
  dataPoints: [],
  numberOfSimilarLocalMaxes: undefined,
  resistanceLine: undefined,
  localMaxArray: [],
  currentMovingAverage: undefined,
  previousPrice: undefined,
  typeOfTrade: undefined,
  tradePlaced: false,
  firstIndexResistanceLine: undefined,
  thresholdSimilarLocalMaxes: undefined
};
