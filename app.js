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
const fetchApi = require("node-fetch")

const messageRoutes = require("./routes/message")
const { addUser, getUser } = require("./users")
const Message = require("./models/message")
const Location = require("./models/location")


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

app.post("/api/chat", messageRoutes)
app.use("/api/chat", messageRoutes)

app.post("/api/add-message", (req, res) => {
	return req.body;
});

const main = async () => {
	const response= await fetchApi("https://pina-app.com/api/users")
	const result= await response.json()
	const users = await result.data
	console.log(users);
	
	io.on("connection", (socket) => {
		socket.on("join", ({ userId, room }) => {
			console.log("Just Joined!")
			const db_user = users.find(user => user.village_id===parseInt(room))
			if (!db_user) return { error: "unauthorized to enter this room" }
			const { user, error } = addUser({ id: socket.id, username: db_user.username, room: db_user.village_id })
			socket.emit("message", {
				username: "admin",
				text: `Hi ${user.username}, Welcome to the chat!`,
			})
	
			socket.broadcast.to(user.room).emit("message", {
				username: "admin",
				text: `${user.username} has joined the chat!`,
			})
	
			socket.join(user.room)
		})
	
		socket.on("chat:send", async ({ userId,username,type, text, url, lat, long }) => {
			const user = getUser(socket.id)
			if(!user) return {message: "not auithroized to enter this room"}
			console.log("GET USER")
			console.log(user)
			const { _doc } = await Message.create({
				type,
				userId,
				username,
				text,
				url,
				lat,
				long
			})
	
			io.to(user.room).emit("chat:message", {
				..._doc,
				createdAt: moment(_doc.createdAt).fromNow(),
			})
		})

		socket.on("currentLocation", async ({ userId, lat, long }) => {
			let location = null;
			location = await Location.find({ userId })
			if (location) {
				location.lat = lat;
				location.long = long;
			}
			else {
				location= await Location.create({userId, lat, long})
			}

			location.save();

			io.emit("upadatedLocation", {
				...location._doc,
				createdAt: moment(_doc.createdAt).fromNow(),
			})
		})
		
	})
	
}

main()
