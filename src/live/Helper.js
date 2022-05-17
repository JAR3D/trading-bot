module.exports = class Helper {
  syncTimer(time) {
    const future = Date.now() + time * 1000;
    while (future - Date.now() > 0) {}
  };
}
