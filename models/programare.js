const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  pacient: {
    type: String,
    unique: true
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
