let roomUsers= []

const addUser = ({ id,userId,username, room }) => {
	const userExists = roomUsers.find(
		(user) => user.id === userId && user.village_id === room
	)

	if (userExists) return { error: "username already exists" }

	const user = { id, username, room }
	roomUsers.push(user)

	return { user }
}

const removeUser = (id) => {
	const index = roomUsers.findIndex((user) => user.id === id)
	if (index !== -1) return roomUSers.splice(index, 1)[0]
}

const getUser = (id) => {
	return roomUsers.find((user) => user.id === id)
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
