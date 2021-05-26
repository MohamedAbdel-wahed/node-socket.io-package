const { model, Schema } = require("mongoose")

const messageSchema = new Schema(
	{
		type: String,
		userId: String,
		username: String,
		room: String,
		text: String,
		url: String,
		lat: Number,
		long: Number,
	},
	{ timestamps: true }
)

const Message = model("Message", messageSchema)

module.exports = Message
