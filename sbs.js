class sbs {
  constructor(cC, url, apiKey, tableName) {
    this.client = cC(url, apiKey);
    this.tableName = tableName;
  }

  async g(table, filters = null, callback) {
    let query = this.client.from(table).select("*");
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    try {
      const { data, error } = await query;
      callback(data, error);
    } catch (err) {
      callback(null, err);
    }
  }

  async i(data, callback) {
    try {
      const query = this.client.from(this.tableName).insert(data).select('*');
      const { data: result, error } = await query;
      callback(error ? null : result, error);
    } catch (err) {
      callback(null, err);
    }
  }

  async d(filters, callback) {
    try {
      const query = this.client.from(this.tableName).delete().match(filters);
      const { data, error } = await query;
      callback(error ? null : data, error);
    } catch (err) {
      callback(null, err);
    }
  }

  async u(data, filters, callback) {
    try {
      let query = this.client.from(this.tableName).update(data);
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      query = query.select('*');
      const { data: result, error } = await query;
      callback(error ? null : result, error);
    } catch (err) {
      callback(null, err);
    }
  }
}
