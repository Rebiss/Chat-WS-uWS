module.exports = class MemCache {
    constructor(prefix = 'chat_') {
      this.prefix = prefix;
      this.cache = {};
    }

    getElements(props, key, count) {
      if (Array.isArray(this.cache[key])) {
        return this.cache[key].slice(-1 * (count || 0));
      }

      return this.cache[key];
    }

    add(props, key, value) {
      key = this.prefix + key;

      if (!this.cache[key]) {
        this.cache[key] = [];
      }

      return this.cache[key].push(value);
    }

    incr(props, key) {
      key = this.prefix + key;

      if (!this.cache[key]) {
        this.cache[key] = 0;
      }

      return ++this.cache[key];
    }

    expire(props, key, seconds) {
      key = this.prefix + key;

      setTimeout(() => {
        delete this.cache[key];
      }, seconds * 1000);
    }

    put(props, key, value) {
      key = this.prefix + key;

      return this.cache[key] = value;
    }

    del(props, key) {
      key = this.prefix + key;

      return delete this.cache[key];
    }
  }