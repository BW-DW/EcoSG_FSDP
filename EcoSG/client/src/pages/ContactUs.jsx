import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactUs() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: yup.object({
      name: yup.string().trim().required('Name is required'),
      email: yup.string().trim().email('Invalid email').required('Email is required'),
      message: yup.string().trim().required('Message is required'),
    }), 
    onSubmit: (data) => {
      try {
        data.name = data.name.trim();
        data.email = data.email.trim();
        data.message = data.message.trim();
        console.log('Submitting form data:', data);
        setSending(true);
        http.post('/contactmessages', data)
          .then((res) => {
            console.log(res.data);
            toast.success('Message sent successfully!');
            navigate('/contactmessages');
          })
          .catch((error) => {
            console.error('Error sending message:', error.response);
            toast.error('Failed to send message');
          })
          .finally(() => {
            console.log('Request finished');
            setSending(false);
          });
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Contact Us
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              multiline
              minRows={4}
              label="Message"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" disabled={sending}>
            {sending? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default ContactUs;