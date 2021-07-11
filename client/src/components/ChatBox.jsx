import React, { useContext,useState} from 'react';
import { Button, TextField, Grid, Typography, Container, Paper, FormControl,AppBar } from '@material-ui/core';

import { SocketContext } from '../Context';

import SendIcon from '@material-ui/icons/Send';


import { makeStyles } from '@material-ui/core/styles';


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
  },
  sendButton: {
    height : "100%",
  },
}));




const ChatBox = ({common}) => {
  console.log("common = " + common);
  const { name,text,setText,sendMessage,setCommonText,commonText,sendCommonMessage} = useContext(SocketContext);
  const [message,setMessage] = useState('');
  
  function addMessage(message){
    if(common){
      
      sendCommonMessage(message);
    }
    else{
      setText(text=>[...text,(name||'You') + " : " + message]);
      sendMessage(message);
    }    
    setMessage('');
    
  }

  function handleSubmit(e){
    e.preventDefault();
    addMessage(message);
  }


  
  const classes = useStyles();

  return (
    <>
      
      <Container maxWidth="md">
         <Grid spacing = {1} container justify = "right">  

          

        {
          common ? 
          commonText != undefined && 
          commonText.map(message =>{
            return (
              <Grid item xs = {12}>
                <Paper  className = {classes.textChat} elevation = {12}> 
                {message} </Paper>
              </Grid>)
          })
          :
          text != undefined && 
          text.map(message =>{
            return (
            <Grid item xs = {12}>
              <Paper  className = {classes.textChat} elevation = {12}> 
              {message} </Paper>
            </Grid>)
          })
        }
        
        <Grid item xs = {10} md = {10}>
          <Paper> 
            <form noValidate autoComplete="off" onSubmit = {handleSubmit}>           
              <FormControl fullWidth>
              <TextField value = {message} placeholder="Type a Message" variant="outlined" onChange={(e) => setMessage(e.target.value) }/>
                
              </FormControl>
            </form>
          </Paper>       
        </Grid>

        <Grid item align = 'right' xs = {2} md = {2}>
          <Button className = {classes.sendButton} size = "large" fullWidth disableElevation size = "small" variant="contained" 
          color="secondary" onClick={()=>{addMessage(message); } }
            > <SendIcon>
              </SendIcon> Send </Button>
        </Grid>       
          
        
        
        
        </Grid>

      </Container>
    </>
  );
};

export default ChatBox;