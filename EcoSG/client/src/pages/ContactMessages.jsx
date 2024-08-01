import React, { useState, useEffect } from 'react'
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody ,TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl} from '@mui/material'
import http from '../http'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const navigate = useNavigate()
  // useEffect(() => {
  // //   const token = localStorage.getItem('token'); // assuming you're storing the token in local storage
  // // axios.get('http://localhost:3001/contact/contactmessages', {
  // //   headers: {
  // //     Authorization: `Bearer ${token}`,
  // //   },
  // // })     
  // }, [])

  // http.get('/contactmessages')
  // .then((res) => {
  //       setMessages(res.data)
  //       setLoading(false)
  //     })
  //    .catch((error) => {
  //       console.error('Error fetching messages:', error.response)
  //     })
  const getMessages = () => {
    http.get('/contactmessages').then((res) => {
      setMessages(res.data)
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching messages:', error)
      setLoading(false);
    });
  };
      useEffect(() => {
        getMessages();
    }, []);
    

    const handleOpen = (id) => {
      setSelectedMessageId(id)  
      setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const deleteMessages = () => {
    //   http.delete(`/contactmessages/${selectedMessageId}`)
    //       .then((res) => {
    //           console.log(res.data);
    //           navigate("/contactmessages");
    //       });
    const deleteMessages = () => {
      http.delete(`/contactmessages/${selectedMessageId}`)
        .then((res) => {
          console.log(res.data)
          getMessages()
          toast.success('Message deleted successfully')
        })
        .catch((error) => {
          console.error('Error deleting message:', error)
          toast.error('Error deleting message')
        })
      setOpen(false)
  }
  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Messages
      </Typography>
      {loading? (
        <Typography variant="body1" sx={{ my: 2 }}>
          Loading...
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>
                <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={() => handleOpen(message.id)}>
                                Delete
                            </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      )}
      <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Message
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this message?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteMessages}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
    </Box>
  )
}

export default Messages;