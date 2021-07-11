import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');
//const socket = io('https://warm-wildwood-81069.herokuapp.com');
const socket = io('https://match-video-chat.herokuapp.com/')

const ContextProvider = ({ children }) => {
  
  // keeping track of the status of the call
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  
  // names
  const [name, setName] = useState('');
  

  const [stream, setStream] = useState();
  
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  
  // text : meeting chat , commonText : common chat
  const [text,setText] = useState(["This is your private chat"]);
  const [commonText,setCommonText] = useState(["This is an open chat room. Say Hi!"]);
  
  // need some properties to keep track of audio and video being muted
  const [showMyAudio,setShowMyAudio] = useState(true);
  const [showMyVideo,setShowMyVideo] = useState(true);
  const [showUserAudio,setShowUserAudio] = useState(true);
  const [showUserVideo,setShowUserVideo] = useState(true);

  // keep track of avatars
  const [myAvatar,setMyAvatar] = useState({color: "orange",text:"N"});
  const [userAvatar,setUserAvatar] = useState({color: "orange",text:"N"});
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const userId = useRef();

  const [userName, setUserName] = useState('');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal },videoStatus,audioStatus) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
      setShowUserVideo(videoStatus);
      setShowUserAudio(audioStatus);
    });

    socket.on("get-message",(name,message) => {
      console.log("got here receiver");
      // setText((text) => {return text + name + " : " + message + "\n"})
      setText((text)=>[...text,name + " : " + message])
    })

    socket.on("toggle-video-status",(status)=>{
      //answerCall();
      setShowUserVideo(status);
    })

    socket.on("toggle-audio-status",(status)=>{
      console.log('setting mute/unmute for caller')
      setShowUserAudio((muted) => !muted);
    })

    socket.on("end-call", ()=>{
      setCallAccepted(false);
      setCallEnded(true);
    })

    socket.on('recieve-message', (message,name) => {
      console.log('recieved common message');
      setCommonText((text)=>[...text,name + " : " + message])
    })

    socket.on("canvas-data", function (data) {
          var root = this;
          var interval = setInterval(function () {
            if (root.isDrawing) return;
            root.isDrawing = true;
            clearInterval(interval);
            var image = new Image();
            var canvas = document.querySelector("#board");
            var ctx = canvas.getContext("2d");
            image.onload = function () {
              ctx.drawImage(image, 0, 0);
    
              root.isDrawing = false;
            };
            image.src = data;
          }, 200);
    });



  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    

    peer.on('signal', (data) => {
      userId.current = call.from;
            
      socket.emit('answerCall', { signal: data, to: call.from }, name,showMyVideo,showMyAudio);
    });

    

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
      
      
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    userId.current = id;

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name },showMyVideo,showMyAudio);
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal,name,videoStatus,audioStatus) => {
      setCallAccepted(true);
      //userName.current = name;
      setUserName(name);
      setShowUserVideo(videoStatus);
      setShowUserAudio(audioStatus);

      //console.log(userName.current);
      peer.signal(signal);
    });

    connectionRef.current = peer;
    
  };

  const leaveCall = () => {
    setCallEnded(true);

    socket.emit('end-call',userId.current);

    connectionRef.current.destroy();

    
  };

  const sendMessage = (message) => {
    if(callAccepted && !callEnded) {
      console.log("got here");
      console.log("going to " + userId.current);
      socket.emit('send-message', name,userId.current,message);
    }
  }

  const sendCommonMessage = (message) => {

    setCommonText((text)=>[...text,name + " : " + message]);
    socket.emit('public-message',name,message);
  }

  const toggleAudio = () => {
    
    // setShowMyAudio((currentStatus) => {
    //   socket.emit("updateMyMedia", {
    //     type: "mic",
    //     currentMediaStatus: !currentStatus,
    //   });
    //   stream.getAudioTracks()[0].enabled = !currentStatus;
    //   return !currentStatus;
    // });
    


    // console.log('tried to toggle my audio');
    // console.log('call accepted =' + callAccepted);
    // console.log('call ended='+callEnded);
    let currentStatus;
    setShowMyAudio((isAudible) =>{
      currentStatus = !isAudible;
      return currentStatus;
    });
    if(true) {
      //console.log('tried to toggle my audio');
      socket.emit('toggle-audio',userId.current,currentStatus);
    }
  }

  const  toggleVideo = () => {
    
    // setShowMyVideo((currentStatus) => {
    //   socket.emit("updateMyMedia", {
    //     type: "video",
    //     currentMediaStatus: !currentStatus,
    //     id : userId.current,
    //   });
    //   stream.getVideoTracks()[0].enabled = !currentStatus;
    //   return !currentStatus;
    // });
    
    //console.log("toggling my video");
    let currentStatus;
    setShowMyVideo((isVisible) =>{ 
      currentStatus = !isVisible;
      return currentStatus;
    });
    

    socket.emit('toggle-video',userId.current,currentStatus);
    
  }

  const updateName = (name) => {
    socket.emit('update-name',userId.current,name);
  }

  const updateAvatar = (avatar) => {
    socket.emit('update-avatar',userId.current,avatar);
  }


  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      sendMessage,
      text,setText,
      userName,      
      showMyAudio,
      showMyVideo,
      showUserAudio,
      showUserVideo,
      setShowUserVideo,
      toggleAudio,
      toggleVideo,
      socket,
      sendCommonMessage,
      commonText,
      setCommonText,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
