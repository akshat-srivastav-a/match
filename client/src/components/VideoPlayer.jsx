import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles, Button } from '@material-ui/core';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { SocketContext } from '../Context';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },       
  },

  videoBox : {
    width : '550px',
    height : '400px',
    justifyText : 'center', 
  },
  
  optionsPaper : {
    width : '600px',
  },

  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '0px',
    border: '0px solid blue',
    margin: '14px 5px 5px 5px',
    
    backgroundColor : 'transparent',
    color: 'white',
  },
  nameStyle : {
    padding : '0px 0px 0px 10px' 
    
  }
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, userAudio, call,userName,
    showMyAudio,showMyVideo,showUserVideo,showUserAudio,setShowUserVideo,toggleAudio,toggleVideo } = useContext(SocketContext);

  const classes = useStyles();
  
  return (
    <Grid container spacing = {1} className={classes.gridContainer}>      
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>

            <video playInline muted ref={myVideo} autoPlay className={classes.video} style = {
              { opacity : `${showMyVideo ? "1" : "0" }` }
            } />           

            {/* <video playsInline muted ref={myVideo} autoPlay className={classes.video} />  */}
            <Grid item xs = {12} md = {6} >
              <Typography variant="h6" className = {classes.nameStyle} gutterBottom>{name || 'Name'}</Typography>
              
            </Grid>
            
          </Grid>
        </Paper>
      )}
           

      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>

            <video playInline muted = {!showUserAudio} ref={userVideo} autoPlay className={classes.video} 
              style = {
                { opacity: `${showUserVideo ? "1" : "0" }`} 
            }/>
            
            <Typography variant="h6" className = {classes.nameStyle} gutterBottom>{ (call.name || userName ||  'Name') + " " }
              { !showUserAudio ? <MicOffIcon fontSize = "small"/> : " "}
              { !showUserVideo ? <VideocamOffIcon fontSize = "small"/> : " "} 
            </Typography>
            
          </Grid>
        </Paper>
      )}

      <Grid item xs = {12} md = {12}/>
      <Paper align = 'center' elevation = {12} className={classes.optionsPaper}>
        <Button onClick={toggleAudio}>
                  {
                    showMyAudio ? <MicIcon fontSize = "large"/> : <MicOffIcon fontSize = "large"/>
                  }
              </Button>
              <Button onClick={toggleVideo}>
                {
                  showMyVideo ? <VideocamIcon fontSize = "large"/> : <VideocamOffIcon fontSize = "large"/>
                }
        </Button>
      </Paper>   
       
      
    </Grid>
  );
};

export default VideoPlayer;
