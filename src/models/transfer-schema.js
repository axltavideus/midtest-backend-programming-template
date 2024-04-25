const mongo = require("mongoose");

const transferSchema = {
  transferId:String,
  fromUserId:{
    type:mongo.Schema.Types.ObjectId,
    ref:'users',
    required: true,
  },
  toUserId:{
    type:mongo.Schema.Types.ObjectId,
    ref:'users',
    required: true,
  },
  amount:Number,
  timestamp: {
    type:Date,
    default: Date.now,
  }
}

module.exports = transferSchema;
