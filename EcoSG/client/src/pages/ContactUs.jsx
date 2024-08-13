import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Divider } from '@mui/material';
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
            navigate('/contactUs');
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
    <Box sx={{ bgcolor: '#e8eae6', p: 4, maxWidth: '800px', margin: 'auto', borderRadius: '8px' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Contact Us
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Leave us a message
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              autoComplete="off"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              autoComplete="off"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
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
            <Button variant="contained" type="submit" disabled={sending} sx={{ mt: 2 }}>
              {sending ? 'Sending...' : 'Submit'}
            </Button>
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={12} md={5}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Contact details
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Person-in-charge: John Little
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Contact number: 94729421
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Email: littlejohnloveskids@gmail.com
          </Typography>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default ContactUs;
