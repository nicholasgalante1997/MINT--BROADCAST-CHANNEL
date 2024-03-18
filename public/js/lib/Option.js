class Option {
  static NULL_OR_VOID_CALLBACK_ERROR =
    'Option is intended for non nullish values. Void functions or side effects should not be invoked via `new Option(...)`. Use an `Attempt.run(...)` instead.';
  constructor(callback) {
    try {
      let t = callback();

      if (t == null) {
        throw new Error(NULL_OR_VOID_CALLBACK_ERROR);
      }

      this.data = t;
      this.error = null;
    } catch (e) {
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
}

export default Option;
