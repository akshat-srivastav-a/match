import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');
//const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [text,setText] = useState(["If you won't speak, then type!"]);
  
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

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("get-message",(name,message) => {
      console.log("got here receiver");
      // setText((text) => {return text + name + " : " + message + "\n"})
      setText((text)=>[...text,name + " : " + message])
    })

    socket.on("toggle-video-status",(status)=>{
      //answerCall();
      setShowUserVideo((status)=>(!status));
    })

    socket.on("toggle-audio-status",(status)=>{
      console.log('setting mute/unmute for caller')
      setShowUserAudio((muted) => !muted);
    })

    socket.on("end-call", ()=>{
      window.location.reload();
    })
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      userId.current = call.from;
      socket.emit('answerCall', { signal: data, to: call.from }, name);
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
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal,name) => {
      setCallAccepted(true);
      //userName.current = name;
      setUserName(name);
      //console.log(userName.current);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const sendMessage = (message) => {
    if(callAccepted && !callEnded) {
      console.log("got here");
      console.log("going to " + userId.current);
      socket.emit('send-message', name,userId.current,message);
    }
  }

  const toggleAudio = () => {
    // console.log('tried to toggle my audio');
    // console.log('call accepted =' + callAccepted);
    // console.log('call ended='+callEnded);
    setShowMyAudio((isAudible) => !isAudible);
    if(callAccepted && !callEnded) {
      console.log('tried to toggle my audio');
      socket.emit('toggle-audio',userId.current,showMyAudio);
    }
  }

  const  toggleVideo = () => {
    
      // if(!showMyVideo){
      //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      // .then((currentStream) => {
      //   setStream(currentStream);

      //   myVideo.current.srcObject = currentStream;
      // });
      // setShowMyVideo((isVisible)=>!isVisible);
     
      // }
      // socket.emit('toggle-video',userId.current,showMyVideo);
    
    
      // don't really expect it so not doing anything
    

    setShowMyVideo((isVisible) => !isVisible);
    if(true){
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });
    }
    socket.emit('toggle-video',userId.current,showMyVideo);
    
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
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
