import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');
const socket = io('https://match-video-chat.herokuapp.com/')

var id = '';

const ContextProvider = ({ children }) => {
  
  // keeping track of the status of the call
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  
  // names
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
 
  // user's audio-video stream
  const [stream, setStream] = useState();
  // call state to keep track of current call data
  const [call, setCall] = useState({});
  // the id socket.io gives 
  // me: current user's id , userId : the caller/callee's id
  const [me, setMe] = useState('');
  const userId = useRef();
  
  // text : meeting chat , commonText : common chat
  const [text,setText] = useState(["This is your private chat"]);
  const [commonText,setCommonText] = useState(["This is an open chat room. Say Hi!"]);
  
  // need some properties to keep track of audio and video being muted
  const [showMyAudio,setShowMyAudio] = useState(true);
  const [showMyVideo,setShowMyVideo] = useState(true);
  const [showUserAudio,setShowUserAudio] = useState(true);
  const [showUserVideo,setShowUserVideo] = useState(true);
  
  // references to streams of users and the connection
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  

  

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
      
      setText((text)=>[...text,name + " : " + message])
    })

    socket.on("toggle-video-status",(status)=>{
      setShowUserVideo(status);
    })

    socket.on("toggle-audio-status",(status)=>{      
      setShowUserAudio(status);
    })

    socket.on("end-call", ()=>{
      
      setCallEnded(true);
      SocketContext.userId ='';
    })

    socket.on('recieve-message', (message,name) => {
      console.log('recieved common message');
      setCommonText((text)=>[...text,name + " : " + message])
    })



  }, []);

  // function called when current user clicks the answer call button
  // to a call being recieved
  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    

    peer.on('signal', (data) => {
      userId.current = call.from;
      SocketContext.userId = userId.current;
      // pass the signal data to transfer video and audio along with name,
      // video status and audio status      
      socket.emit('answerCall', { signal: data, to: call.from }, name,showMyVideo,showMyAudio);
    });

    
    // once the peer's stream is available we set the userVideo reference 
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;     
      
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  // function called when current user intitates a call 
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    userId.current = id;
    SocketContext.userId = id;

    // when we call a user we pass the signal data, id of user to call,
    // current user's id and the audio and video status
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name },showMyVideo,showMyAudio);
    });

    // when the peer's stream is available, set the userVideo reference
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    // event that occurs when the call made is accepted
    socket.on('callAccepted', (signal,name,videoStatus,audioStatus) => {
      setCallAccepted(true);
      // setting user's name, audio and video status
      setUserName(name);
      setShowUserVideo(videoStatus);
      setShowUserAudio(audioStatus);
      
      peer.signal(signal);
    });

    connectionRef.current = peer;
    
  };

  // called when the user clicks on the hand up button
  const leaveCall = () => {
    setCallEnded(true);
    
    SocketContext.userId = '';
    socket.emit('end-call',userId.current);

    connectionRef.current.destroy();

    
  };

  // send message in private chat visible only to those users
  // in the current meeting
  const sendMessage = (message) => {
    // only send this message if currently in a call
    if(callAccepted && !callEnded) {      
      socket.emit('send-message', name,userId.current,message);
    }
  }

  // function to send message in the open chat
  const sendCommonMessage = (message) => {    
    socket.emit('public-message',name,message);
  }

  // function to toggle audio status of current user
  const toggleAudio = () => {  
    
    let currentStatus;
    // since the "setState" functions are asynchronous, we need to keep track of
    // current status 
    setShowMyAudio((isAudible) =>{
      currentStatus = !isAudible;
      return currentStatus;
    });
    socket.emit('toggle-audio',userId.current,currentStatus);
  }

  // function to toggle video status of current user
  const  toggleVideo = () => {    
  
    let currentStatus;
    // since the "setState" functions are asynchronous, we need to keep track of
    // current status 
    setShowMyVideo((isVisible) =>{ 
      currentStatus = !isVisible;
      return currentStatus;
    });
    

    socket.emit('toggle-video',userId.current,currentStatus);
    
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
      userId,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};



export { ContextProvider, SocketContext };
