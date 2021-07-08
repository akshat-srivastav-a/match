import React, {useState} from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import ChatBox from './components/ChatBox';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


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
      <ChatBox common = {false}></ChatBox>
      
      
    </div>
  );
};

export default App;
