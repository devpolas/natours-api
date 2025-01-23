const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "./../../config.env" });

const Tour = require("./../../models/tourModel");

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

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8");

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log("Tours Data successfully Loaded!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Tours Data successfully Deleted!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Something is going wrong");
}
