import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function EditDialog({ open, handleClose, field, handleSave, initialValue }) {
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = yup.object({
    currentPassword: field === 'password'
        ? yup.string().trim().required('Current Password is required')
        : yup.string(),
    value: field === 'password'
        ? yup.string().trim().min(8, 'Password must be at least 8 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "Password at least 1 letter and 1 number")
        : field === 'dob'
        ? yup.date().required('Date of Birth is required').max(new Date(), "Date of Birth cannot be in the future")
        .min("1945-1-1", "Date is too early").typeError('Invalid Date of Birth')
        : yup.string().trim().required(`${field} is required`),
    confirmPassword: field === 'password'
        ? yup.string().oneOf([yup.ref('value'), null], 'Passwords must match').required('Confirm Password is required')
        : yup.string(),
});

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      value: field === 'dob' ? (initialValue ? dayjs(initialValue) : null) : initialValue || '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await handleSave(field === 'dob' ? dayjs(values.value).toISOString() : values.value, values.currentPassword);
        handleClose();
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    enableReinitialize: true, // This will ensure that formik updates the form values if the initialValue prop changes
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setErrorMessage('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {field}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {field === 'password' && (
              <TextField
                fullWidth
                margin="dense"
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              />
            )}
          {field === 'password' ? (
            <>
              <TextField
                fullWidth
                margin="dense"
                label="New Password"
                name="value"
                type="password"
                value={formik.values.value}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </>
          ) : field === 'dob' ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disableFuture
                format="DD/MM/YYYY"
                label="Date Of Birth"
                name="value"
                value={formik.values.value}
                onChange={(date) => formik.setFieldValue('value', date)}
                onBlur={() => formik.setFieldTouched('value', true)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="dense"
                    error={formik.touched.value && Boolean(formik.errors.value)}
                    helperText={formik.touched.value && formik.errors.value}
                  />
                )}
              />
            </LocalizationProvider>
            // <LocalizationProvider dateAdapter={AdapterDateFns}>
            //   <DatePicker
            //     label="Date of Birth"
            //     inputFormat="dd/MM/yyyy"
            //     value={formik.values.value}
            //     onChange={(date) => formik.setFieldValue('value', date)}
            //     renderInput={(params) => (
            //       <TextField
            //         {...params}
            //         fullWidth
            //         margin="dense"
            //         error={formik.touched.value && Boolean(formik.errors.value)}
            //         helperText={formik.touched.value && formik.errors.value}
            //       />
            //     )}
            //   />
            // </LocalizationProvider>
          ) : (
            <TextField
              fullWidth
              margin="dense"
              label={`Enter new ${field}`}
              name="value"
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.value && Boolean(formik.errors.value)}
              helperText={formik.touched.value && formik.errors.value}
            />
          )}
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditDialog;