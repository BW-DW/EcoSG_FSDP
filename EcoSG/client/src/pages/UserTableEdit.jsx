import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function UserTableEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [errorMessages, setErrorMessages] = useState({}); // State for validation error messages

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      dob: '',
      // points: '',
      // hours: '',
      // totalEvents: '',
      // donate: ''
    },
    validationSchema: yup.object({
      name: yup.string().trim().min(3).max(50).required("Name is required"),
      email: yup.string().trim().lowercase().email().max(50).required("Email is required"),
      dob: yup.date().nullable().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
      // points: yup.number().nullable(),
      // hours: yup.number().nullable(),
      // totalEvents: yup.number().nullable(),
      // donate: yup.number().nullable()
    }),
    onSubmit: async (data) => {
      try {
        // Clear previous errors
        setErrorMessages({});
        
        // Make API request to update the user
        await http.put(`/user/${id}`, data);
        
        // Navigate back to user list
        navigate('/users');
      } catch (error) {
        // Check if the error is due to validation and extract messages
        if (error.response && error.response.data && error.response.data.errors) {
          setErrorMessages(
            error.response.data.errors.reduce((acc, err) => {
              const [field, message] = err.split(': ');
              acc[field] = message;
              return acc;
            }, {})
          );
        }
        
        console.error('Error updating user:', error);
      }
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await http.get(`/user/${id}`);
        formik.setValues(response.data);
        setCurrentRole(response.data.role); // Set current role
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleRoleChange = async () => {
    try {
      const newRole = currentRole === 'staff' ? 'customer' : 'staff';
      await http.put(`/user/${id}/role/${newRole}`);
      navigate('/users'); // Navigate back to UserTable
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const handlePromoteDemoteClick = () => {
    const message = currentRole === 'staff'
      ? 'Demotion of this user will revoke their access to staff items and pages, are you sure?'
      : 'Promotion of this user will allow this user to access staff items and pages, are you sure?';

    setConfirmationMessage(message);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = (confirmed) => {
    setConfirmationOpen(false);
    if (confirmed) {
      handleRoleChange();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit User
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense"
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={(formik.touched.name && Boolean(formik.errors.name)) || Boolean(errorMessages.name)}
          helperText={(formik.touched.name && formik.errors.name) || errorMessages.name}
        />
        <TextField
          fullWidth margin="dense"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(errorMessages.email)}
          helperText={(formik.touched.email && formik.errors.email) || errorMessages.email}
        />
        <TextField
            fullWidth
            margin="dense"
            label="Date of Birth"
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.dob && Boolean(formik.errors.dob)) || Boolean(errorMessages.dob)}
            helperText={(formik.touched.dob && formik.errors.dob) || errorMessages.dob}
            InputLabelProps={{
                shrink: true,
            }}
        />
        {/* Uncomment and adjust fields as needed */}
        {/* <TextField
            fullWidth
            margin="dense"
            label="Points"
            name="points"
            type="number"
            value={formik.values.points}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.points && Boolean(formik.errors.points)) || Boolean(errorMessages.points)}
            helperText={(formik.touched.points && formik.errors.points) || errorMessages.points}
        />
        <TextField
            fullWidth
            margin="dense"
            label="Hours"
            name="hours"
            type="number"
            value={formik.values.hours}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.hours && Boolean(formik.errors.hours)) || Boolean(errorMessages.hours)}
            helperText={(formik.touched.hours && formik.errors.hours) || errorMessages.hours}
        />
        <TextField
            fullWidth
            margin="dense"
            label="Total Events"
            name="totalEvents"
            type="number"
            value={formik.values.totalEvents}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.totalEvents && Boolean(formik.errors.totalEvents)) || Boolean(errorMessages.totalEvents)}
            helperText={(formik.touched.totalEvents && formik.errors.totalEvents) || errorMessages.totalEvents}
        />
        <TextField
            fullWidth
            margin="dense"
            label="Donate"
            name="donate"
            type="number"
            value={formik.values.donate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.donate && Boolean(formik.errors.donate)) || Boolean(errorMessages.donate)}
            helperText={(formik.touched.donate && formik.errors.donate) || errorMessages.donate}
        /> */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" type="submit">
                Update
            </Button>
            <Button
                variant="outlined"
                color={currentRole === 'staff' ? 'error' : 'primary'}
                onClick={handlePromoteDemoteClick}
            >
                {currentRole === 'staff' ? 'Demote' : 'Promote'}
            </Button>
        </Box>
    </Box>

        {/* Confirmation Dialog */}
        <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogContent>
                <DialogContentText>{confirmationMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleConfirmationClose(false)}>Cancel</Button>
                <Button onClick={() => handleConfirmationClose(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
    );
}

export default UserTableEdit;