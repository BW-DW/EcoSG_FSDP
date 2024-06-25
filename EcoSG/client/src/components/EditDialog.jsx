import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function EditDialog({ open, handleClose, field, handleSave, initialValue }) {
  const validationSchema = yup.object({
    value: field === 'password'
        ? yup.string().trim().min(8, 'Password must be at least 8 characters').required('Password is required')
        : field === 'dob'
        ? yup.date().required('Date of Birth is required')
        : yup.string().trim().required(`${field} is required`),
    confirmPassword: field === 'password'
        ? yup.string().oneOf([yup.ref('value'), null], 'Passwords must match').required('Confirm Password is required')
        : yup.string(),
});

  const formik = useFormik({
      initialValues: { value: initialValue || '', confirmPassword: '' },
      validationSchema,
      onSubmit: (values) => {
          if (field !== 'password' || values.value === values.confirmPassword) {
              handleSave(field === 'dob' ? values.value.toISOString() : values.value);
              handleClose();
          }
      },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {field}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                inputFormat="dd/MM/yyyy"
                value={formik.values.value}
                onChange={(date) => formik.setFieldValue('value', date)}
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