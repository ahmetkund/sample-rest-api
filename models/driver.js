var mongoose = require("mongoose");

var driverSchema = new mongoose.Schema({
  location: {
    type: [Number]
  },
  name: { required: true, type: String }
}, { collection: 'drivers' });

driverSchema.index({ location: "2dsphere" });

var Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
