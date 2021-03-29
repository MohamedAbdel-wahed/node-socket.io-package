let users = []

const addUser = ({ id, username, room }) => {
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()

	const existingUser = users.find(
		(user) => user.username === username && username.room === room
	)

	if (existingUser) {
		return { error: "username already exists" }
	}

	const user = { id, username, room }
	users.push(user)

	return { user }
}

const removeUser = (id) => users.filter((user) => user.id !== id)

const getUser = (id) => {
	return users.find((user) => user.id === id)
}

const getRoomUsers = (room) => {
	return users.filter((user) => user.room === room)
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getRoomUsers,
}
