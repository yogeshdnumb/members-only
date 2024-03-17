const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const postsSchema = mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  content: String,
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "Users" },
});

postsSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Posts", postsSchema);
