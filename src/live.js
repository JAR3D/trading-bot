const BotStrategy = require('./BotStrategy');
const Helper = require('./Helper');
const KrakenApi = require('./KrakenApi');

(async function init() {
  const strategy = new BotStrategy();
  const helper = new Helper();
  const kraken = new KrakenApi();

  while (true) {
    const currentAskPrice = await kraken.getCurrentAskPrice({ pair: 'ADAUSDT'});
    strategy.tick({ price: currentAskPrice });
    helper.syncTimer(3);
  }
})()
