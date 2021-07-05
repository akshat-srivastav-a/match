const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data,name) => {
		console.log(name + " tried to answer call");
		io.to(data.to).emit("callAccepted", data.signal,name)
	});

	socket.on("send-message",(name,userId,message) =>{
		console.log("got here server");
		console.log("sending to " + userId);
		io.to(userId).emit("get-message",name,message);
	})

	socket.on("toggle-video",(userId,show) =>{
		console.log("toggling vidoe");
		io.to(userId).emit("toggle-video-status",show);
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
