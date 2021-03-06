const moment = require("moment")
const cors = require("cors")
const express = require("express")
const { connect } = require("mongoose")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
})

const messageRoutes = require("./routes/message")

app.use(cors())
app.use("/uploads", express.static("uploads"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoUrl = `mongodb+srv://mohamed:test1234@cluster0.vh16z.mongodb.net/ws?retryWrites=true&w=majority`

connect(mongoUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
})
	.then(() => {
		console.log("Mongodb Connected Successfully")
		server.listen(process.env.PORT || 5000, () =>
			console.log(`Server is ready on port 5000`)
		)
	})
	.catch((err) => console.log(err))

app.get("/", (req, res) => {
	res.send("Hello World")
})

app.post("/api/chat", messageRoutes)

const { addUser, getUser } = require("./users")
const Message = require("./models/message")

app.use("/api/chat", messageRoutes)

io.on("connection", (socket) => {
	const room = "default"
	socket.on("join", (username) => {
		const { user, error } = addUser({ id: socket.id, username, room })

		socket.emit("message", {
			username: "admin",
			text: `Hi ${username}, Welcome to the chat!`,
		})

		socket.broadcast.to(user.room).emit("message", {
			username: "admin",
			text: `${username} has joined the chat!`,
		})

		socket.join(user.room)
	})

	socket.on("sendText", async ({ type, text, url, lat, long }) => {
		const user = getUser(socket.id)
		const { _doc } = await Message.create({
			type,
			username: user.username,
			text,
			url,
			lat,
			long,
		})

		io.to(user.room).emit("message", {
			..._doc,
			createdAt: moment(_doc.createdAt).fromNow(),
		})
	})

	socket.on("sendImg", async ({ type, text, url, lat, long }) => {
		const user = getUser(socket.id)
		const { _doc } = await Message.create({
			type,
			username: user.username,
			text,
			url,
			lat,
			long,
		})

		io.to(user.room).emit("message", {
			..._doc,
			createdAt: moment(_doc.createdAt).fromNow(),
		})
	})

	socket.on("sendLocation", async ({ type, text, url, lat, long }) => {
		const user = getUser(socket.id)
		const { _doc } = await Message.create({
			type,
			username: user.username,
			text,
			url,
			lat,
			long,
		})

		io.to(user.room).emit("message", {
			..._doc,
			createdAt: moment(_doc.createdAt).fromNow(),
		})
	})
})
