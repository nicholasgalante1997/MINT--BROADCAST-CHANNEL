import Logger from './Logger.js';

class OptionAsync {
  static NULL_OR_VOID_CALLBACK_ERROR =
    'Option is intended for non nullish values. Void functions or side effects should not be invoked via `new Option(...)`. Use an `Attempt.run(...)` instead.';
  constructor() {}
  async invoke(callback) {
    try {
      let t = await callback();

      if (t == null) {
        throw new Error(NULL_OR_VOID_CALLBACK_ERROR);
      }

      this.data = t;
      this.error = null;
    } catch (e) {
      Logger.error(
        'OptionAsync performed %s and threw %s',
        callback?.displayName || 'AnonFn',
        e
      );

      this.data = null;
      this.error = e;
    }
  }

  match(some, none) {
    if (this.data && !this.error) {
      return some(this.data);
    } else {
      return none(this.error);
    }
  }

  ok() {
    if (this.data) {
      return this.data;
    } else {
      return null;
    }
  }

  none() {
    return this.error;
  }
}

export default OptionAsync;
