const mongoose = require("mongoose");

const filterMasterSchema = new mongoose.Schema({
  type: { type: String, required: true }, // caste, city, state, etc.
  name: { type: String, required: true },
  parent: { type: String, default: "-" }, // optional (for caste hierarchy)
  usage: { type: Number, default: 0 }, // tracking how many times selected
});

module.exports = mongoose.model("FilterMaster", filterMasterSchema);
