import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles, Button } from '@material-ui/core';

import { SocketContext } from '../Context';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },       
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
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call,userName,
    showMyAudio,showMyVideo,showUserVideo,showUserAudio,setShowUserVideo } = useContext(SocketContext);
  const classes = useStyles();
  
  return (
    <Grid container spacing = {1} className={classes.gridContainer}>      
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            
            {console.log(showMyVideo)}
            {
              showMyVideo ? 
              <video playsInline muted ref={myVideo} autoPlay className={classes.video} /> 
              : <div ref = {myVideo} className={classes.video}> Video Hidden </div>
            }

            

            {/* <video playsInline muted ref={myVideo} autoPlay className={classes.video} />  */}
            <Typography variant="h6" className = {classes.nameStyle} gutterBottom>{name || 'Name'}</Typography>
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            
            {console.log(showUserVideo)}
            {
              showUserVideo && showUserAudio ? 
              <video playsInline ref={userVideo} autoPlay className={classes.video} /> :
              showUserVideo ? <video playInline muted ref={userVideo} autoPlay className={classes.video} /> :
              showUserAudio ? <audio playInline ref={userVideo} autoPlay /> :
              <div ref={userVideo} className={classes.video} /> 
            }
            {/* {
              showUserVideo && <video muted playsInline ref={userVideo} autoPlay className={classes.video} /> 
            }
            {
              showUserAudio && <audio playInline ref={userVideo} autoPlay/>
            } */}

            <Typography variant="h6" className = {classes.nameStyle} gutterBottom>{ call.name || userName ||  'Name' }</Typography>
            
          </Grid>
        </Paper>
      )}
       
      
    </Grid>
  );
};

export default VideoPlayer;
