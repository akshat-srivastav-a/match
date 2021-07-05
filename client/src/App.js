import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import ChatBox from './components/ChatBox';

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

const App = () => {
  const classes = useStyles();

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
      <ChatBox />
    </div>
  );
};

export default App;
