const { Schema, model } = require('mongoose');

// TITHE  = {amount, _id, date, person_id
const titheSchema = new Schema({

  amount: {
    type: Number,
    required: true,
  },
  date  :  { 
    type: Date, 
    default: Date.now 
  }
});

//const Tithe = model('Tithe', titheSchema);

module.exports = titheSchema;
