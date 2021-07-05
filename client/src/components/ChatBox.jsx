import React, { useContext,useState} from 'react';
import { Button, TextField, Grid, Typography, Container, Paper, FormControl,AppBar } from '@material-ui/core';

import { SocketContext } from '../Context';



import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  textChat: {
    padding : '10px',
  }
}));





function NewlineText(props) {
    const text = props.text;
    return text.split('\n').map(str => <p>{str}</p>);
}



const ChatBox = () => {
  const { name,text,setText,sendMessage } = useContext(SocketContext);
  const [message,setMessage] = useState('');
  
  function addMessage(message){
    setText(text=>[...text,(name||'You') + " : " + message]);
    setMessage('');
  }

  function handleSubmit(e){
    e.preventDefault();
    addMessage(message);
    sendMessage(message); 
  }

  
  const classes = useStyles();

  return (
    <>
      
      <Container maxWidth="md">
         <Grid spacing = {1} container justify = "right">
           <Grid item xs = {12}>
           <AppBar position="static">
              <Typography variant="h4" component = "h1" align = "center"> Text Chat </Typography>
           </AppBar>
           </Grid>

          {/* <Grid item xs = {6}>
          <Avatar alt="Remy Sharp" src="D:/Web Dev Workspace/engage/react-video-chat/project_video_chat/client/src/components/avatar1.jpg" className={classes.small} />
          <Avatar alt="Remy Sharp" src="s/avatar1.jpg" />
          <Avatar alt="Remy Sharp" src="../static/images/avatar1.jpg" className={classes.large} />
          </Grid> */}

          {/* <Paper>
            <NewlineText text = {text}></NewlineText>       
            
          </Paper> */}

          

        {
          text != undefined && 
          text.map(message =>{
            return (
            <Grid item xs = {12}>
              <Paper  className = {classes.textChat} elevation = {12}> 
              {message} </Paper>
            </Grid>)
          })
        }
        
        <Grid item xs = {12} md = {12}>
          <Paper> 
            <form noValidate autoComplete="off" onSubmit = {handleSubmit}>           
              <FormControl fullWidth>
              <TextField value = {message} placeholder="Type a Message" variant="outlined" onChange={(e) => setMessage(e.target.value) }/>
                
              </FormControl>
            </form>
          </Paper>       
        </Grid>

        <Grid item xs = {12} md = {12}>
          <Button disableElevation size = "small" variant="contained" color="secondary" 
            onClick={()=>{addMessage(message); sendMessage(message);}}
            > Send </Button>
        </Grid>       
          
        
        
        
        </Grid>

      </Container>
    </>
  );
};

export default ChatBox;