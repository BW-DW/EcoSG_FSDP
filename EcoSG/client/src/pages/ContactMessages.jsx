import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const navigate = useNavigate();

  const getMessages = () => {
    http.get('/contactmessages').then((res) => {
      setMessages(res.data);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handleOpen = (id) => {
    setSelectedMessageId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteMessages = () => {
    http.delete(`/contactmessages/${selectedMessageId}`)
      .then((res) => {
        console.log(res.data);
        getMessages();
        toast.success('Message deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        toast.error('Error deleting message');
      });
    setOpen(false);
  };

  const handleReplyOpen = (email,id) => {
    setSelectedEmail(email);
    setSelectedMessageId(id);
    setReplyOpen(true);
  };

  const handleReplyClose = () => {
    setReplyOpen(false);
  };

  const sendReply = () => {
    const data = {
      to: selectedEmail,
      subject: 'Reply to your message',
      text: replyContent,
      replyMessage: replyContent
    };

    http.post(`/contactmessages/${selectedMessageId}/reply`, data)
      .then((res) => {
        console.log(res.data);
        toast.success('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        toast.error('Error sending email');
      });
    setReplyOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Messages
      </Typography>
      {loading ? (
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" sx={{ mr: 2 }}
                    onClick={() => handleReplyOpen(message.email,message.id)}>
                    Reply
                  </Button>
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteMessages}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onClose={handleReplyClose}>
        <DialogTitle>Reply to Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={selectedEmail}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            label="Message"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleReplyClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={sendReply}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default Messages;
