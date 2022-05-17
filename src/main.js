const fs = require("fs");
const { Command } = require("commander");

const { syncTimer, formateDate } = require("./helpers");

const { getPairPrice, getPairKLine } = require("./api");
let {
  appVars: {
    options,
    emitter,
    pricesForMovingAverage,
    chartIntervals,
    getPairKLinePromise,
    googleChart,
    canSubmitAnotherRequest,
    historicalData,
    counterTillNPoints,
    nextDataPoint,
    lastPairPrice,
    dataDate,
    dataPoints,
    numberOfSimilarLocalMaxes,
    resistanceLine,
    localMaxArray,
    currentMovingAverage,
    previousPrice,
    typeOfTrade,
    tradePlaced,
    firstIndexResistanceLine,
    thresholdSimilarLocalMaxes = 0.0000025,
  },
} = require("./vars");

options = parseArgs();
pricesForMovingAverage = new Array(+options.points).fill(0);

// chart html
let chartHtml = googleChart.trim();

if (options.help) {
  console.log(
    "main.js -p <period> -i <interval> -c <currency> -n <points> -s <startTime> -e <endTime>"
  );
  process.exit();
}

if (options.interval && !chartIntervals.includes(options.interval)) {
  console.log("binance requires intervals ", chartIntervals);
  process.exit(2);
}

// getPairKLinePromise
if (options.startTime) {
  getPairKLinePromise = getPairKLine({
    symbol: options.currency || "XMRBTC",
    interval: options.interval || "3m",
    startTime: options.startTime,
    endTime: options.endTime,
  });
}

// wait for getPairKLinePromise then start emmiting
Promise.all([getPairKLinePromise]).then((data) => {
  historicalData = data[0].data || undefined; // only returns something if startTime was set
  while (true) {
    if (canSubmitAnotherRequest) emitter.emit("timeEvent");

    if (!options.startTime) {
      syncTimer(2);
    }
  }
});
////////////////////////////////////////////////////////////////

emitter.on("timeEvent", async () => {
  canSubmitAnotherRequest = false;
  if (counterTillNPoints < parseInt(options.points)) {
    counterTillNPoints++;
  }
  const dateNow = new Date();
  try {
    if (options.startTime && historicalData.length > 0) {
      nextDataPoint = historicalData.shift();
      if (!nextDataPoint) process.exit();
      lastPairPrice = parseFloat(nextDataPoint[4]); // close price
      const date = new Date(nextDataPoint[6]); // close time
      //dataDate = formateDate(date);
      dataDate = date;
    } else if (options.startTime && historicalData.length === 0) {
      for (let i = 0; i < dataPoints.length; i++) {
        chartHtml += `
            [new Date(${dataPoints[i]["date"]}), ${dataPoints[i]["price"]}, '${dataPoints[i]["label"]}', '${dataPoints[i]["desc"]}', ${dataPoints[i]["trend"]}],
          `;
      }

      chartHtml += `
                    ]);
                    var options = {
                      title: 'Price Chart',
                      legend: { position: 'bottom' }, 
                      explorer: { 
                        actions: ['dragToZoom', 'rightClickToReset'],
                        axis: 'horizontal',
                        keepInBounds: true,
                        maxZoomIn: 4.0
                      },
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                    chart.draw(data, options);
                  }
                </script>
              </head>
            <body>
              <div id="curve_chart" style="width: 100%; height: 100%"></div>
            </body>
          </html>
          `;
      fs.writeFileSync("./output.html", chartHtml.trim());
      process.exit();
    } else {
      console.log("### waiting for request... ###");
      const { data } = await getPairPrice(options.currency || "XMRBTC");
      lastPairPrice = parseFloat(data.price);
      dataDate = formateDate(dateNow);
    }

    canSubmitAnotherRequest = true;

    /*
    Calculate the moving average
     */
    // at this point pricesForMovingAverage is an [0,0,0,0,0]
    pricesForMovingAverage.push(lastPairPrice);
    pricesForMovingAverage.shift();
    currentMovingAverage =
      pricesForMovingAverage.reduce((a, b) => a + b, 0) / counterTillNPoints;

    dataPoints.push({
      date: dataDate.getTime(),
      price: lastPairPrice,
      trend: resistanceLine || null,
      label: "",
      desc: "",
    });

    if (
      dataPoints.length > 2 &&
      dataPoints[dataPoints.length - 2]["price"] >
        dataPoints[dataPoints.length - 1]["price"] &&
      dataPoints[dataPoints.length - 2]["price"] >
        dataPoints[dataPoints.length - 3]["price"]
    ) {
      // dataPoints[dataPoints.length - 2]["label"] = "MAX";
      // dataPoints[dataPoints.length - 2]["desc"] = "This is a local maximum";

      numberOfSimilarLocalMaxes = 0;
      localMaxArray.forEach((oldMax) => {
        if (
          oldMax["price"] >
            dataPoints[dataPoints.length - 2]["price"] -
              thresholdSimilarLocalMaxes &&
          oldMax["price"] <
            dataPoints[dataPoints.length - 2]["price"] +
              thresholdSimilarLocalMaxes
        ) {
          numberOfSimilarLocalMaxes++;

          if (numberOfSimilarLocalMaxes === 1) {
            firstIndexResistanceLine = oldMax["date"];
          }
        }
      });

      localMaxArray.push(dataPoints[dataPoints.length - 2]);

      if (numberOfSimilarLocalMaxes >= 2) {
        const dataPointsIndexRi = dataPoints.findIndex(
          (element) => element["date"] === firstIndexResistanceLine
        );
        const dataPointsIndexRo = dataPoints.findIndex(
          (element) =>
            element["date"] === dataPoints[dataPoints.length - 2]["date"]
        );

        for (let i = dataPointsIndexRi + 1; i < dataPointsIndexRo; i++) {
          if (dataPoints[i]["price"] > dataPoints[dataPointsIndexRo] + thresholdSimilarLocalMaxes) {
            localMaxArray = [];
            break;
          }
        }

        if (localMaxArray.length !== 0) {
          dataPoints[dataPointsIndexRi]["label"] = "ri";

          dataPoints[dataPoints.length - 2]["trend"] =
            dataPoints[dataPoints.length - 2]["price"];

          dataPoints[dataPoints.length - 1]["trend"] =
            dataPoints[dataPoints.length - 2]["price"];

          dataPoints[dataPoints.length - 2]["label"] = "ro";

          resistanceLine = dataPoints[dataPoints.length - 2]["price"];

          localMaxArray = [];
        }
      }
    }

    previousPrice = pricesForMovingAverage[pricesForMovingAverage.length - 2];

    if (!tradePlaced) {
      if (
        lastPairPrice > currentMovingAverage &&
        lastPairPrice < previousPrice
      ) {
        console.log("### SELL ORDER ###");
        //tradePlaced = true;
        typeOfTrade = "short";
      } else if (
        lastPairPrice < currentMovingAverage &&
        lastPairPrice > previousPrice
      ) {
        console.log("### BUY ORDER ###");
        //tradePlaced = true;
        typeOfTrade = "long";
      }
    } else if (typeOfTrade === "short") {
      if (lastPairPrice < currentMovingAverage) {
        console.log("### EXIT TRADE ###");
        tradePlaced = false;
        typeOfTrade = "";
      }
    } else if (typeOfTrade === "long") {
      if (lastPairPrice > currentMovingAverage) {
        console.log("### EXIT TRADE ###");
        tradePlaced = false;
        typeOfTrade = "";
      }
    }

    process.stdout.write(`${dateNow.getDate()}-`);
    process.stdout.write(`${dateNow.getMonth() + 1}-`);
    process.stdout.write(`${dateNow.getFullYear()} `);
    process.stdout.write(
      `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()} `
    );
    process.stdout.write(
      `Period: ${options.period}s ${
        options.currency || "XMRBTC"
      }: ${lastPairPrice} `
    );
    process.stdout.write(`MA: ${currentMovingAverage}\n`);
  } catch (err) {
    console.log("### ERROR ###", err);
  }
});
////////////////////////////////////////////////////////////////

function parseArgs() {
  const program = new Command();
  program
    .option("-h, --help", "show help")
    .option("-p, --period <type>", "to input a period")
    .option("-c, --currency <type>", "to input a currency")
    .option("-n, --points <type>", "to input a number of points")
    .option("-i, --interval <type>", "to input a interval")
    .option("-s, --start-time <type>", "to input a start time")
    .option("-e, --end-time <type>", "to input a end time")
    .parse(process.argv);

  return program.opts();
}
