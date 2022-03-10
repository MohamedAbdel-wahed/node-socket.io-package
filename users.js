let roomUsers = []


const addUser = ({ id,username, room }) => {
	const userExists = roomUsers.find(
		(user) => user.id === id && user.room === room
	)

	if (userExists) return { error: "username already exists" }

	const user = { id, username, room }
	roomUsers.push(user)

	console.log("Room Users")
	console.log(roomUsers)

	return { user }
}

const removeUser = (id) => {
	const index = roomUsers.findIndex((user) => user.id === id)
	if (index !== -1) return roomUSers.splice(index, 1)[0]
}

const getUser = (id) => {
	console.log(id) 
	return roomUsers.find((user) => user.id==id)
}

const getRoomUsers = (room) => {
	return roomUsers.filter((user) => user.room === room)
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getRoomUsers
}
