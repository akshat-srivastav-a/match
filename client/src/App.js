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
  // appBar: {
  //   borderRadius: 15,
  //   margin: '30px 100px',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '600px',
  //   border: '2px solid black',

  //   [theme.breakpoints.down('xs')]: {
  //     width: '90%',
  //   },
  // },
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}


const App = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.wrapper}>
      <AppBar className = {classes.appBar} position="static" color="inherit">
        <Typography variant="h4" align="left">Match</Typography>
      </AppBar>
      {/* <h3 className={classes.appBar}>
        Teams
      </h3> */}
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
