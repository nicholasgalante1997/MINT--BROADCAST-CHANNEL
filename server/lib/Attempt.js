class Attempt {
  static run(fn, onError = null, retry = 0) {
    try {
      fn();
    } catch (e) {
      if (retry > 0) {
        Attempt.run(fn, onError, --retry);
        return;
      }

      if (onError != null && typeof onError === 'function') {
        onError(e);
      }
    }
  }

  static async runAsync(fn, onError = null, retry = 0) {
    try {
      await fn();
    } catch (e) {
      if (retry > 0) {
        await Attempt.runAsync(fn, onError, --retry);
        return;
      }

      if (onError != null && typeof onError === 'function') {
        onError(e);
      }
    }
  }
}

export default Attempt;
