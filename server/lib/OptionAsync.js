import Logger from './Logger.js';

class OptionAsync {
  static NULL_OR_VOID_CALLBACK_ERROR =
    'Option is intended for non nullish values. Void functions or side effects should not be invoked via `new Option(...)`. Use an `Attempt.run(...)` instead.';

  /**
   * @private
   * @type {(...args: any[]) => Promise<any>}
   * */
  _callback = null;

  /** @private */
  _resolved = false;

  /** @private */
  _rejected = false;

  /**
   *
   * @param {(...args: any[]) => Promise<any>} callback
   */
  constructor(callback) {
    this._callback = callback;
  }

  async call() {
    try {
      let t = await this._callback();

      if (t == null) {
        throw new Error(NULL_OR_VOID_CALLBACK_ERROR);
      }

      this.data = t;
      this.error = null;
      this._resolved = true;
    } catch (e) {
      Logger.error('OptionAsync performed %s and threw %s', this._callback?.displayName || 'AnonFn', e);

      this.data = null;
      this.error = e;
      this._rejected = true;
    }
  }

  ok() {
    return this.data;
  }

  none() {
    return this.error;
  }

  asPromise() {
    if (this._callback == null) {
      Logger.error('OptionAsync was not instantiated with a callback.');
      return null;
    }

    if (this._resolved || this._rejected) {
      Logger.error('Promise has already been consumed (awaited and set internally).');
      return null;
    }

    return this._callback();
  }
}

export default OptionAsync;
