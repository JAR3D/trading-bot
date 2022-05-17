import { Command } from "commander";
import { IValidateOptions } from "../types/types";

export function parseArgs() {
  const program = new Command();
  program
    .option("-h, --help", "show help")
    .option("-p, --pair <type>", "to input a pair")
    .option("-n, --points-for-ma <type>", "to input a number of points for MA")
    .option("-i, --interval <type>", "to input a interval")
    .option("-l, --limit <type>", "#candles to backtest")
    .parse(process.argv);

  return program.opts();
}

export const validateOptions = ({ options, appVars }: IValidateOptions) => {
  if (options.help) {
    console.log("main.js -i <interval> -l <limit> -p <pair> -n <pointsforma>");
    process.exit();
  }

  if (options.interval && !appVars.chartIntervals.includes(options.interval)) {
    console.log("binance requires intervals ", appVars.chartIntervals);
    process.exit(2);
  }
}