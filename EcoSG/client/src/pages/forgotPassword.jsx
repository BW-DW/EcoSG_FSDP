import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
        }),
        onSubmit: (data) => {
            setIsLoading(true);
            http.post("/user/forgot-password", data)
                .then((res) => {
                    toast.success('Password reset link has been sent to your email!');
                    navigate("/login");
                })
                .catch((err) => {
                    const errorMessage = Array.isArray(err.response.data.message)
                        ? err.response.data.message.join(', ')
                        : err.response.data.message;
                    toast.error(errorMessage);
                })
                .finally(() => setIsLoading(false));
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, textAlign: 'center' }}>
                Enter your email address below and we will send you a link to reset your password.
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default ForgotPassword;