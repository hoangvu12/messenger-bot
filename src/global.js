class Global {
  static set(key, value) {
    this[key] = value;
  }

  static get(key) {
    return this[key];
  }

  static has(key) {
    return !!this[key];
  }
}

module.exports = Global;
