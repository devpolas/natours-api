class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };

    //! ignoring excludesFields form query
    const excludesFields = ["limit", "page", "sort", "fields"];
    excludesFields.forEach((el) => delete queryObject[el]);

    //! Advance Query

    let modifiedQuery = JSON.stringify(queryObject);
    modifiedQuery = modifiedQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    //? querying
    this.query = this.query.find(JSON.parse(modifiedQuery));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // query = query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
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

//? copy the query object
// const queryObject = { ...req.query };

// //! ignoring excludesFields form query

// const excludesFields = ['limit', 'page', 'sort', 'fields'];
// excludesFields.forEach((el) => delete queryObject[el]);

// //! Advance Query

// let modifiedQuery = JSON.stringify(queryObject);
// modifiedQuery = modifiedQuery.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`
// );

// //? querying
// let query = Tour.find(JSON.parse(modifiedQuery));

// sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   // query = query.sort('-createdAt');
// }

// limiting fields
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

//! pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// //_________________________________________
// query data from database with mongoose

// const tours = await Tour.find({
//   difficulty: 'easy',
//   duration: 5,
// });

// or

// const tours = Tour.find()
//   .where('difficulty')
//   .equals('easy')
//   .where('duration')
//   .equals(5);

////__________________________________________
module.exports = APIFeatures;
