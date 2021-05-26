const { model, Schema } = require("mongoose")

const messageSchema = new Schema(
	{
		type: {
			type: String
		},
		userId: {
			type: String
		},
		username: {
			type: String
		},
		room: {
			type: String
		},
		text: {
			type: String
		},
		url: {
			type: String
		},
		lat: {
			type: Number
		},
		long: {
			type: Number
		}
	},
	{ timestamps: true }
)

const Message = model("Message", messageSchema)

module.exports = Message
