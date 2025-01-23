const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connect mongodb with mongoose
mongoose
  .connect(DB)
  .then(() => console.log("connected"))
  .catch((err) => {
    console.log(err);
  });

// server start with port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
