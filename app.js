const moment = require("moment")
const cors = require("cors")
const express = require("express")
const { connect } = require("mongoose")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
	cors: "*"
})
const fetchApi = require("node-fetch")
const axios =require("axios")

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

const main = async () => {
	const response= await axios("https://pina-app.com/api/chat/users")
	const users = await response.data.data

	// console.log(users)

	io.on("connection", (socket) => {
			console.log(`new user connected!`)
		socket.on("join", ({ userId, room }) => {
			console.log("start db")
			const db_user = users.find(user => user.id===userId && user.village_id === parseInt(room))
			console.log(db_user)
			if (!db_user) {
				io.emit("unjoin", { status: 401 })
				return;
			}

			console.log(`new user just joined!`)

			const { user, error } = addUser({ id: socket.id, username: db_user.username, room: db_user.village_id })
			socket.emit("chat:message", {
				username: "admin",
				text: `Hi ${user.username}, Welcome to the chat!`,
			})
	
			socket.broadcast.to(user.room).emit("message", {
				username: "admin",
				text: `${user.username} has joined the chat!`
			})

			socket.join(user.room)
		})
	
		socket.on("chat:send", async (data) => {
			console.log("sending new message...")
			const user = getUser(socket.id)
			if (!user) return { message: "not authroized to enter this room" }

			axios({
				url: 'https://pina-app.com/api/chat/add-message',
				method: 'get',
				data
			})
			.then(res => {
				console.log(res?.data || res)
				console.log("new message sent")
			})
			.catch(err => console.log(err))
		
			// const { _doc } = await Message.create(data)
	
			// io.to(user.room).emit("chat:message", {
			// 	..._doc,
			// 	// createdAt: moment(_doc.createdAt).fromNow(),
			// })
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