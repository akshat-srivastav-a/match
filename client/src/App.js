import React, {useState} from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import ChatBox from './components/ChatBox';
import Board from './components/Board/Board';


import {Grid} from '@material-ui/core';




const useStyles = makeStyles((theme) => ({
  appBar : {
    backgroundColor:'#2F2FA2',
    
    color : 'white',
    align: 'left',
    padding : '10px',
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));



const App = () => {
  const classes = useStyles();
  

 

  return (
    <div className={classes.wrapper}>
      <AppBar className = {classes.appBar} position="static" color="inherit">
        <Typography variant="h4" align="left">Match</Typography>
      </AppBar>

      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
      <Grid container spacing={1}>
        <Grid item md = {6} xs = {12}><ChatBox common = {true}></ChatBox></Grid>
        <Grid item md = {6} xs = {12}><ChatBox common = {false}></ChatBox></Grid>
      </Grid>   
      
    </div>
  );
};

export default App;
