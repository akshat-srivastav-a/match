const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

// hello

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	// This event sends a particular user connecting to the server
	// its unique id(assigned by socket.io)
	socket.emit("me", socket.id);

	// event to disconnect the users from a particular call(not server)
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	// event to call a user, passed in the userId of the user to call
	// signalData(simple-peer), id of caller, name of caller
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	// event to answer an incoming call
	// takes in signal data and name of receiver to send to the caller
	socket.on("answerCall", (data,name) => {
		console.log(name + " tried to answer call");
		io.to(data.to).emit("callAccepted", data.signal,name)
	});

	// event to send a message in the meeting
	socket.on("send-message",(name,userId,message) =>{
		console.log("got here server");
		console.log("sending to " + userId);
		io.to(userId).emit("get-message",name,message);
	})

	// event to toggle whether the video is being hidden or shown
	socket.on("toggle-video",(userId,show) =>{
		console.log("toggling video");
		io.to(userId).emit("toggle-video-status",show);
	});

	// event to mute/unmute yourself
	socket.on("toggle-audio",(userId,show) =>{
		console.log("toggling audio");
		io.to(userId).emit("toggle-audio-status",show);
	})


	// event to send a message to everyone connected to the server/socket
	socket.on("public-message",(room,message)=>{
		console.log("public message : " + message);
	})
	
	socket.on("updateMyMedia", ({type,currentMediaStatus,id}) => {
		console.log(" updating " + type);
		io.to(userId).emit("updateUserMedia", type , currentMediaStatus,id);
	})

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
