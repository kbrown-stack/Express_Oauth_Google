//This file  below defines the books model schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define the Book schema

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  shortDescription: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
    max: [2020, " Year must be less than 2020 or equal to 2020"], // this is validation with customised messga.
  },

  isbn: {
    type: String,
    required: true,
    unique: [true, "ISBN must be unique"], //this is validation with customised messga.
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must ne greater than 0 or equal 0"], //this is validation with customised messga.
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
});

const bookModel = mongoose.model("Book", BookSchema);
module.exports = bookModel;
