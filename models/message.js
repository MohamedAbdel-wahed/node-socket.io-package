const {model,Schema}= require("mongoose")

const messageSchema= new Schema({
  type: String,
  username: String,
  text: String,
  url: String, 
  coords: {
    lat: Number,
    long: Number
  }
}, {timestamps: true})

const Message= model("Message", messageSchema)


module.exports= Message