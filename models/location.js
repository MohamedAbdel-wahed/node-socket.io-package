const { model, Schema } = require("mongoose")

const locationSchema = new Schema(
	{
		userId: {
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

const Location = model("Location", locationSchema)

module.exports = Location
