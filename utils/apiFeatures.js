class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryOgj = { ...this.queryString };
    const excluededFields = ["page", "sort", "limit", "fields"];
    excluededFields.forEach(el => delete queryOgj[el]);

    // 2) filtering advance query

    let queryString = JSON.stringify(queryOgj);
    queryString = queryString.replace(
      /\b(gte|ge|lte|lt)\b/g,
      matches => `$${matches}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt");
    }
    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
