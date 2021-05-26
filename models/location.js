const { model, Schema } = require("mongoose")

const locationSchema = new Schema(
	{
		userId: String,
		lat: Number,
		long: Number,
	},
	{ timestamps: true }
)

const Location = model("Location", locationSchema)

module.exports = Location
