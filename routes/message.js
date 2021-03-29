const multer = require("multer")
const express = require("express")
const moment = require("moment")
const Message = require("../models/message")
const router = express.Router()

router.get("/messages", async (req, res) => {
	try {
		let messages = await Message.find()
		messages = messages.map((msg) => ({
			...msg._doc,
			createdAt: moment(msg.createdAt).fromNow(),
		}))
		res.status(200).json(messages)
	} catch (err) {
		console.log(err)
		res.status(500).json({ error: "unexpected error!" })
	}
})


router.post("/sendimg", (req, res) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "uploads/")
		},
		filename: function (req, file, cb) {
			cb(null, `${Date.now()}-${file.originalname}`)
		},
	})

	const upload = multer({ storage }).single("file")
	upload(req, res, (error) => {
		if (error) {
			console.log(error)
			return res.status(500).json({ success: false, error })
		}

		return res.status(200).json({ success: true, url: res.req.file.path })
	})
})

module.exports = router
