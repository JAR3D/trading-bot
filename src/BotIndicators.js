module.exports = class BotIndicators {
  constructor() {
    this.counterTillLengthForMovingAverage = 0;
  }
  movingAverage(dataPoints, lengthForMovingAverage) {
    if (this.counterTillLengthForMovingAverage < lengthForMovingAverage) {
      this.counterTillLengthForMovingAverage++;
    }
    const pointsForMovingAverage = dataPoints.slice(
      dataPoints.length - this.counterTillLengthForMovingAverage
    );
    return (
      pointsForMovingAverage.reduce((a, b) => a + b, 0) / this.counterTillLengthForMovingAverage
    );
  }
};
